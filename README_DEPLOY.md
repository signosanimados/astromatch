# 🚀 DEPLOY SIMPLIFICADO - GUIA RÁPIDO

## ⚠️ IMPORTANTE: O Backend NÃO vai no Vercel

O **backend** (pasta `backend/`) foi criado para rodar **separadamente** do frontend.

- ✅ **Frontend** → Deploy no Vercel (automático via GitHub)
- ❌ **Backend** → Precisa rodar em outro lugar (não no Vercel)

## 📦 O que acontece quando você faz push no GitHub?

1. Você faz push → GitHub atualiza
2. Vercel detecta a mudança → Faz build automático
3. **Vercel IGNORA a pasta `backend/`** → Só compila o frontend
4. Site atualizado! ✨

## 🔧 Correções Aplicadas

Foram feitos estes ajustes para o deploy funcionar:

1. **`tsconfig.json`** → Agora exclui a pasta `backend/` do build
2. **`vercel.json`** → Configurado para ignorar backend
3. **`vite-env.d.ts`** → Adicionado para tipos do Vite
4. **`geminiService.ts`** → Removido import que causava erro

## ✅ Como verificar se está funcionando

Depois do push, vá em:
- Vercel Dashboard → Seu projeto → Deployments

Se der erro:
- Clique no deployment → "View Build Logs"
- Copie o erro e me envie

## 🌟 Como usar o Mapa Astral Preciso (Backend)

### Opção 1: Rodar localmente (no seu computador)

```bash
# 1. Entre na pasta backend
cd backend

# 2. Instale dependências
npm install

# 3. Baixe os arquivos de efemérides
./setup-ephe.sh

# 4. Rode o servidor
npm run dev
```

Pronto! Backend rodando em `http://localhost:3001`

### Opção 2: Deploy do Backend (Render, Railway, etc.)

O backend pode ser colocado em:
- **Render** (gratuito): https://render.com
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io

**Passos básicos (Render):**
1. Crie conta no Render
2. "New Web Service"
3. Conecte o GitHub
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`
7. Adicione os arquivos `.se1` na pasta `ephe/` (upload manual ou script)

## 🎯 Resumo

| O que | Onde roda | Como |
|-------|-----------|------|
| **Frontend** (React) | Vercel | Automático via GitHub ✅ |
| **Backend** (Swiss Ephemeris) | Render/Railway/Local | Manual (precisa configurar) |

## ❓ FAQ

**P: O backend vai subir junto no Vercel?**
R: Não. O Vercel só roda o frontend. Backend precisa rodar separado.

**P: Por que não juntar tudo?**
R: O backend usa Swiss Ephemeris (arquivos grandes) e precisa de Node.js rodando. Vercel tem limitações para isso.

**P: Posso usar o frontend sem o backend?**
R: Sim! O componente `BirthChart.tsx` original (com Gemini) continua funcionando. O `BirthChartPrecise.tsx` precisa do backend rodando.

**P: Deu erro de build no Vercel, o que faço?**
R: Me envie o log do erro. Acesse: Vercel → Deployments → (clique no deployment com erro) → Build Logs → copie e cole aqui.

## 📞 Precisa de Ajuda?

Se aparecer algum erro, me mande:
1. Print do erro no Vercel
2. Ou copie o "Build Log" completo

---

**Última atualização:** 2025-12-10
