import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Inicializa Stripe e Supabase usando variáveis de ambiente do servidor (Vercel)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('🔔 Webhook recebido:', req.method);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      console.error('❌ Stripe signature ausente');
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('❌ STRIPE_WEBHOOK_SECRET não configurada');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('✅ Evento validado:', event.type, 'ID:', event.id);
  } catch (err) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processar checkout completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const amountTotal = session.amount_total || 0;
    const sessionId = session.id;

    console.log('💳 Checkout completado:', {
      sessionId,
      userId,
      amountTotal,
      currency: session.currency,
      paymentStatus: session.payment_status
    });

    if (!userId) {
      console.error('❌ client_reference_id não encontrado na sessão');
      return res.status(400).json({ error: 'Missing client_reference_id' });
    }

    if (session.payment_status !== 'paid') {
      console.log('⚠️ Pagamento não confirmado ainda:', session.payment_status);
      return res.status(200).json({ received: true, note: 'Payment not confirmed yet' });
    }

    try {
      // 1 Real = 1 Crédito (centavos / 100)
      const creditsToAdd = Math.floor(amountTotal / 100);

      console.log(`💰 Processando ${creditsToAdd} créditos para usuário ${userId}`);

      // Verificar se perfil existe
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('credits, id')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('❌ Erro ao buscar perfil:', fetchError);
        throw new Error(`Profile not found: ${fetchError.message}`);
      }

      if (!profile) {
        console.error('❌ Perfil não existe para userId:', userId);
        throw new Error('Profile does not exist');
      }

      const currentCredits = profile.credits || 0;
      const newBalance = currentCredits + creditsToAdd;

      console.log(`📊 Créditos: ${currentCredits} → ${newBalance} (+${creditsToAdd})`);

      // Atualizar créditos
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          credits: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (updateError) {
        console.error('❌ Erro ao atualizar créditos:', updateError);
        throw updateError;
      }

      // Registrar transação (opcional - crie a tabela se quiser histórico)
      try {
        await supabase.from('transactions').insert({
          user_id: userId,
          type: 'purchase',
          amount: creditsToAdd,
          stripe_session_id: sessionId,
          price_paid: amountTotal,
          currency: session.currency || 'brl',
          created_at: new Date().toISOString()
        });
      } catch (txError) {
        // Não falhar se tabela não existir
        console.log('ℹ️ Não foi possível registrar transação (tabela pode não existir):', txError.message);
      }

      console.log(`✅ SUCESSO! Usuário ${userId} recebeu ${creditsToAdd} créditos. Novo saldo: ${newBalance}`);

      return res.status(200).json({
        received: true,
        creditsAdded: creditsToAdd,
        newBalance: newBalance
      });

    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error);
      console.error('Stack:', error.stack);
      return res.status(500).json({
        error: 'Database update failed',
        message: error.message
      });
    }
  }

  // Processar outros eventos (opcional)
  if (event.type === 'payment_intent.succeeded') {
    console.log('💳 Payment intent succeeded:', event.data.object.id);
  }

  if (event.type === 'payment_intent.payment_failed') {
    console.log('❌ Payment failed:', event.data.object.id);
  }

  console.log('✅ Evento processado:', event.type);
  res.status(200).json({ received: true });
}