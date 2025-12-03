
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        const creditsToAdd = Math.floor(amountTotal / 100);

        console.log(`Processando pagamento para usuário ${userId}: +${creditsToAdd} créditos.`);

        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        if (fetchError) {
            console.error('Erro ao buscar perfil:', fetchError);
        }

        const currentCredits = profile?.credits || 0;
        const newBalance = currentCredits + creditsToAdd;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ credits: newBalance })
          .eq('id', userId);

        if (updateError) throw updateError;

        console.log(`✅ Sucesso! Usuário ${userId} agora tem ${newBalance} créditos.`);
      } catch (error) {
        console.error('❌ Erro crítico ao atualizar Supabase:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }
    } else {
        console.warn('⚠️ Pagamento recebido sem ID de usuário (client_reference_id).');
    }
  }

  res.status(200).json({ received: true });
}
