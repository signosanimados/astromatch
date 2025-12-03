# 🔧 Guia de Configuração: Stripe + Supabase

Siga este guia passo a passo para configurar a sincronização automática de créditos após pagamento.

---

## 📋 **Checklist Rápido**

- [ ] 1. Configurar variáveis de ambiente no Vercel
- [ ] 2. Fazer deploy no Vercel
- [ ] 3. Configurar webhook no Stripe
- [ ] 4. Testar com pagamento de teste
- [ ] 5. Verificar logs no Vercel

---

## 🚀 **PASSO 1: Configurar Variáveis de Ambiente no Vercel**

### 1.1. Acesse o Dashboard do Vercel
- Vá para: https://vercel.com/dashboard
- Selecione seu projeto: `astromatch`

### 1.2. Configure as Variáveis
Vá em **Settings** → **Environment Variables** e adicione:

#### **Client-side (Frontend)**
```bash
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
```

#### **Server-side (Webhook)**
```bash
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... (SERVICE_ROLE, não ANON!)
STRIPE_SECRET_KEY = sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET = whsec_... (vamos pegar isso no passo 3)
```

⚠️ **IMPORTANTE:**
- `SUPABASE_SERVICE_ROLE_KEY` tem poderes de admin, nunca exponha no frontend!
- Para `STRIPE_WEBHOOK_SECRET`, deixe vazio por enquanto. Vamos pegar no passo 3.

### 1.3. Aplicar em Todos os Ambientes
Marque: ☑️ Production, ☑️ Preview, ☑️ Development

---

## 🚀 **PASSO 2: Deploy no Vercel**

### 2.1. Fazer Deploy
```bash
git add -A
git commit -m "feat: Melhorar webhook do Stripe com logs detalhados"
git push
```

### 2.2. Aguardar Deploy
- O Vercel vai fazer deploy automaticamente
- Aguarde terminar (~2 minutos)

### 2.3. Anotar URL do Webhook
Sua URL do webhook será:
```
https://seu-projeto.vercel.app/api/webhook
```

Exemplo:
```
https://astromatch.vercel.app/api/webhook
```

---

## 🎯 **PASSO 3: Configurar Webhook no Stripe**

### 3.1. Acesse o Dashboard do Stripe
- Vá para: https://dashboard.stripe.com/
- **Modo Teste** (para testar primeiro): Clique em "Visualizar dados de teste" no canto superior direito

### 3.2. Criar Webhook
1. Vá em **Developers** → **Webhooks**
2. Clique em **+ Add endpoint**

### 3.3. Configurar o Endpoint

**Endpoint URL:**
```
https://seu-projeto.vercel.app/api/webhook
```

**Eventos a escutar:**
Selecione apenas:
- ✅ `checkout.session.completed`

(Opcional, mas recomendado):
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

### 3.4. Salvar e Pegar o Webhook Secret

Após criar, você verá uma página com:
```
Signing secret: whsec_abc123...
```

1. Clique em **Reveal** para ver o secret completo
2. **COPIE** esse valor: `whsec_...`

### 3.5. Adicionar no Vercel

Volte ao Vercel:
- **Settings** → **Environment Variables**
- Edite `STRIPE_WEBHOOK_SECRET`
- Cole o valor: `whsec_...`
- **IMPORTANTE:** Clique em **Redeploy** após salvar!

---

## 🧪 **PASSO 4: Testar Pagamento**

### 4.1. Usar Modo de Teste do Stripe

No Stripe Dashboard (modo teste), use estes cartões:

**Cartão que FUNCIONA:**
```
Número: 4242 4242 4242 4242
Data: 12/34
CVV: 123
CEP: Qualquer
```

**Cartão que FALHA:**
```
Número: 4000 0000 0000 0002
```

### 4.2. Fazer um Pagamento de Teste

1. Abra seu app: `https://seu-projeto.vercel.app`
2. Faça login
3. Clique em **Comprar Créditos**
4. Complete o checkout com o cartão de teste
5. Aguarde ~30 segundos

### 4.3. Verificar se os Créditos Foram Adicionados

1. Atualize a página
2. Verifique se os créditos aumentaram

---

## 🔍 **PASSO 5: Verificar Logs (Troubleshooting)**

### 5.1. Logs do Vercel

Vá para: **Vercel Dashboard** → **Seu Projeto** → **Logs**

Procure por logs do webhook:
```
🔔 Webhook recebido: POST
✅ Evento validado: checkout.session.completed
💳 Checkout completado: { sessionId, userId, ... }
💰 Processando X créditos para usuário ...
📊 Créditos: 0 → 10 (+10)
✅ SUCESSO! Usuário recebeu 10 créditos
```

### 5.2. Logs do Stripe

Vá para: **Stripe Dashboard** → **Developers** → **Webhooks**

Clique no seu webhook e veja os **eventos recentes**:
- ✅ Verde = Sucesso (200)
- ❌ Vermelho = Erro

Se houver erros, clique para ver detalhes.

---

## ❌ **Problemas Comuns**

### ❌ Créditos não aparecem

**Possíveis causas:**

1. **Webhook não configurado no Stripe**
   - Solução: Volte ao Passo 3

2. **STRIPE_WEBHOOK_SECRET incorreto**
   - Sintoma: Erro "Webhook Error: ..." nos logs
   - Solução: Copie novamente o secret do Stripe Dashboard

3. **client_reference_id não está sendo enviado**
   - Verifique se o botão de compra inclui o userId na URL:
   ```javascript
   const checkoutUrl = `${STRIPE_CHECKOUT_URL}?client_reference_id=${session.user.id}`;
   ```

4. **Variável SUPABASE_SERVICE_ROLE_KEY errada**
   - Sintoma: "Profile not found" nos logs
   - Solução: Verifique se é o SERVICE_ROLE_KEY, não o ANON_KEY

5. **Webhook URL incorreta**
   - Verifique se termina com `/api/webhook`
   - Exemplo correto: `https://astromatch.vercel.app/api/webhook`

### ❌ Erro 401/403 no webhook

**Causa:** Vercel não consegue acessar o Supabase

**Solução:**
1. Verifique as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
2. Certifique-se que não está usando `VITE_SUPABASE_URL` no webhook

### ❌ Stripe retorna 400/500

**Ver detalhes no Stripe:**
1. Dashboard → Developers → Webhooks
2. Clique no webhook
3. Veja os eventos com erro
4. Clique em um evento para ver o erro exato

---

## 🎉 **PASSO 6: Ativar Modo Produção**

Após testar no modo teste:

### 6.1. Mudar para Modo Live no Stripe
1. No Stripe Dashboard, tire o "Modo de teste"
2. Copie as chaves LIVE:
   - `sk_live_...` (Secret Key)

### 6.2. Criar Novo Webhook para Produção
1. Em modo Live, crie um novo webhook
2. Mesma URL: `https://seu-projeto.vercel.app/api/webhook`
3. Mesmos eventos: `checkout.session.completed`
4. Copie o novo `whsec_...` (é diferente do teste!)

### 6.3. Atualizar Variáveis no Vercel
```bash
STRIPE_SECRET_KEY = sk_live_... (nova chave)
STRIPE_WEBHOOK_SECRET = whsec_... (novo secret)
```

### 6.4. Redeploy
Após salvar, clique em **Redeploy** no Vercel.

---

## 📊 **Verificar Funcionamento**

### Checklist Final:

- [ ] Fazer um pagamento real (pode ser R$1,00)
- [ ] Aguardar 30 segundos
- [ ] Atualizar página e verificar créditos
- [ ] Verificar logs do Vercel (deve ter ✅ SUCESSO)
- [ ] Verificar no Stripe (evento deve estar verde)

---

## 🆘 **Precisa de Ajuda?**

1. **Verifique os logs do Vercel primeiro** - Eles têm emojis para facilitar!
2. **Verifique o Stripe Dashboard** - Veja se o webhook está recebendo eventos
3. **Cole os logs aqui** - Se precisar de ajuda, mande print dos logs

---

## 📝 **Notas Importantes**

- ⚠️ **Webhook Secret é diferente** no modo teste vs. produção
- ⚠️ **Sempre faça redeploy** após mudar variáveis de ambiente
- ⚠️ **Aguarde ~30s** após pagamento para webhook processar
- ✅ **Os logs agora têm emojis** para você encontrar problemas rapidamente!

---

**Tabela Opcional: transactions**

Se quiser histórico de compras, crie esta tabela no Supabase:

```sql
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'purchase', 'deduction', etc.
  amount INTEGER NOT NULL, -- créditos
  stripe_session_id TEXT,
  price_paid INTEGER, -- centavos
  currency TEXT DEFAULT 'brl',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para buscar por usuário
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
```

O webhook já tenta gravar nessa tabela, mas não falha se ela não existir.
