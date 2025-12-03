
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { buffer } from 'micro';

// Configurações do Vercel para não processar o corpo da requisição automaticamente
// (Necessário para o Stripe verificar a assinatura e evitar fraudes)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Inicializa o Stripe com a chave secreta (que você deve configurar no Vercel)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Inicializa o Supabase com a chave SERVICE ROLE (Permissão Admin)
// CUIDADO: Esta chave dá acesso total ao banco, só use no backend (aqui).
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Apenas aceita método POST (o padrão de Webhooks)
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;

  try {
    // Lê o corpo bruto da requisição para validação
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    // 1. Verifica a assinatura do Stripe para garantir que o aviso é legítimo
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Se a assinatura for válida, processa o evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Pega o ID do usuário que enviamos no frontend via client_reference_id
    const userId = session.client_reference_id;
    const amountTotal = session.amount_total || 0; // Valor em centavos (ex: 500 = R$ 5,00)

    if (userId) {
      try {
        // LÓGICA DE CRÉDITOS
        // Regra atual: R$ 1,00 = 1 crédito. (Dividimos centavos por 100)
        // Exemplo: R$ 5,00 -> 5 créditos.
        // Ajuste aqui se sua regra de preço for diferente.
        const creditsToAdd = Math.floor(amountTotal / 100);

        console.log(`Processando pagamento para usuário ${userId}: +${creditsToAdd} créditos.`);

        // Busca saldo atual do usuário no Supabase
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        if (fetchError) {
            console.error('Erro ao buscar perfil:', fetchError);
            // Se não achar perfil, tenta continuar assumindo 0 (pode ser arriscado se o usuário não existir)
            // throw fetchError; // Descomente para parar se der erro
        }

        const currentCredits = profile?.credits || 0;
        const newBalance = currentCredits + creditsToAdd;

        // Atualiza o saldo com os novos créditos
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ credits: newBalance })
          .eq('id', userId);

        if (updateError) throw updateError;

        console.log(`✅ Sucesso! Usuário ${userId} agora tem ${newBalance} créditos.`);
      } catch (error) {
        console.error('❌ Erro crítico ao atualizar Supabase:', error);
        // Retorna 500 para o Stripe tentar de novo mais tarde
        return res.status(500).json({ error: 'Database update failed' });
      }
    } else {
        console.warn('⚠️ Pagamento recebido sem ID de usuário (client_reference_id).');
    }
  }

  // Retorna 200 OK para o Stripe saber que recebemos
  res.status(200).json({ received: true });
}
