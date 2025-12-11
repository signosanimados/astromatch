import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Inicializa Stripe e Supabase usando variáveis de ambiente do servidor (Vercel)
// Isso é seguro e não expõe suas chaves no GitHub.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const amountTotal = session.amount_total || 0;

    if (userId) {
      try {
        // 1 Real = 1 Crédito (centavos / 100)
        const creditsToAdd = Math.floor(amountTotal / 100);

        console.log(`Processando pagamento para ${userId}: +${creditsToAdd} créditos.`);

        // Busca o perfil existente
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        let newBalance;

        if (profile) {
          // Perfil existe - soma créditos
          newBalance = (profile.credits || 0) + creditsToAdd;

          const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newBalance })
            .eq('id', userId);

          if (updateError) throw updateError;
        } else {
          // Perfil não existe - cria com os créditos comprados + 3 bônus
          newBalance = creditsToAdd + 3;

          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ id: userId, credits: newBalance });

          if (insertError) {
            // Pode ter sido criado por outra requisição, tenta update
            const { error: retryError } = await supabase
              .from('profiles')
              .update({ credits: newBalance })
              .eq('id', userId);

            if (retryError) throw retryError;
          }

          console.log(`📝 Perfil criado para novo usuário com ${newBalance} créditos.`);
        }

        console.log(`✅ Sucesso! Novo saldo: ${newBalance}`);
      } catch (error) {
        console.error('❌ Erro Supabase:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }
    }
  }

  res.status(200).json({ received: true });
}