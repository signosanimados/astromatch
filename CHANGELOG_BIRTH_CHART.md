# 📝 Changelog - Sistema de Mapa Astral Profissional

## ✨ O que foi adicionado

### 🎯 Backend Completo com Swiss Ephemeris

- ✅ **API Node.js + Express** para cálculos astrológicos precisos
- ✅ **Swiss Ephemeris** integrado (mesma precisão do Astro.com)
- ✅ **Conversão de Timezone** com Luxon (IANA timezones)
- ✅ **Cálculos incluídos:**
  - Posições dos 10 planetas (Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno, Urano, Netuno, Plutão)
  - 12 Casas astrológicas (sistema Placidus)
  - Ascendente e Meio do Céu (MC)
  - Aspectos maiores (Conjunção, Sextil, Quadratura, Trígono, Oposição)
  - Planetas retrógrados (detecção automática)
  - Distribuição de elementos (Fogo, Terra, Ar, Água)
  - Distribuição de modalidades (Cardinal, Fixo, Mutável)

### 🎨 Frontend Atualizado

- ✅ **Novo componente:** `BirthChartPrecise.tsx`
  - Interface moderna e profissional
  - Formulário completo com validação
  - Geocoding básico para cidades brasileiras
  - Opção de coordenadas manuais
  - Exibição detalhada de todos os dados do mapa
  - Status da API em tempo real

- ✅ **Serviço de API:** `birthChartApiService.ts`
  - Cliente HTTP para comunicação com backend
  - Helpers para parsing de datas
  - Geocoding integrado
  - Health check da API

### 📦 Arquivos Criados

```
Novos arquivos:
├── shared/
│   └── birthChartTypes.ts              # Tipos TypeScript compartilhados
│
├── backend/                             # Novo diretório
│   ├── src/
│   │   ├── server.ts                    # Servidor Express
│   │   ├── birthChartService.ts         # Lógica Swiss Ephemeris
│   │   └── utils/helpers.ts             # Funções auxiliares
│   ├── ephe/                            # Diretório para efemérides
│   ├── package.json                     # Dependências backend
│   ├── tsconfig.json                    # Config TypeScript
│   ├── .env.example                     # Exemplo de variáveis
│   ├── .gitignore                       # Git ignore
│   ├── setup-ephe.sh                    # Script instalação efemérides
│   └── README.md                        # Doc do backend
│
├── services/
│   └── birthChartApiService.ts          # Cliente API frontend
│
├── components/
│   └── BirthChartPrecise.tsx            # Componente novo
│
├── .env.example                         # Config frontend
├── BIRTH_CHART_GUIDE.md                 # Guia completo
└── CHANGELOG_BIRTH_CHART.md             # Este arquivo
```

### 🔧 Tecnologias Utilizadas

**Backend:**
- Express.js
- TypeScript
- swisseph (Swiss Ephemeris)
- Luxon (timezone handling)
- CORS

**Frontend:**
- React + TypeScript (já existente)
- Fetch API
- Tipos compartilhados

## 🚀 Como Usar

### Instalação Rápida

```bash
# 1. Instalar dependências do backend
cd backend
npm install

# 2. Baixar efemérides (OBRIGATÓRIO)
./setup-ephe.sh
# OU manualmente: baixe .se1 files de https://www.astro.com/ftp/swisseph/ephe/

# 3. Iniciar backend
npm run dev

# 4. Em outro terminal, iniciar frontend
cd ..
npm run dev
```

### Uso no Código

**Opção 1: Usar novo componente (recomendado)**

```tsx
import BirthChartPrecise from './components/BirthChartPrecise';

<BirthChartPrecise onBack={() => setScreen('home')} />
```

**Opção 2: Integrar com componente existente**

```tsx
import { calculateBirthChartApi } from './services/birthChartApiService';

// Dentro do seu componente:
const chart = await calculateBirthChartApi({
  year: 1990,
  month: 3,
  day: 15,
  hour: 14,
  minute: 30,
  latitude: -23.5505,
  longitude: -46.6333,
  timezone: 'America/Sao_Paulo'
});

console.log(chart.planets); // Posições dos planetas
console.log(chart.ascendant); // Ascendente
```

## 📊 Diferenças vs. Cálculo Anterior

| Feature | Antes | Agora |
|---------|-------|-------|
| Precisão | Fórmulas aproximadas | Swiss Ephemeris (profissional) |
| Planetas | Órbitas circulares simples | Efemérides reais |
| Retrogradação | Math.random() | Velocidade real calculada |
| Casas | Casas iguais (30° cada) | Placidus (real) |
| Ascendente | Fórmula simplificada | Cálculo astronômico preciso |
| Timezone | Não tratado | Conversão correta com Luxon |
| Comparável a | Nada profissional | Astro.com, Astrodienst |

## 🎓 Próximos Passos (Sugestões)

- [ ] Integrar API de geocoding real (Google/OpenCage)
- [ ] Adicionar mais pontos (Nodos Lunares, Lilith, Chiron)
- [ ] Visualização gráfica do mapa (SVG)
- [ ] Interpretações automáticas por IA (já tem com Gemini!)
- [ ] Sinastria (compatibilidade entre mapas)
- [ ] Trânsitos e progressões
- [ ] Sistema de casas configurável (Koch, Equal, etc.)
- [ ] Cache de resultados
- [ ] Rate limiting da API

## 📚 Documentação Completa

Leia: **BIRTH_CHART_GUIDE.md**

## 🐛 Problemas Conhecidos

- Geocoding básico só tem algumas cidades brasileiras
- Sem validação de datas muito antigas (antes de 1800)
- API precisa rodar localmente (sem deploy ainda)

## ⚡ Performance

- Cálculo médio: ~50-100ms
- Depende dos arquivos de efemérides (.se1)
- Cache pode ser implementado para melhorias

## 🤝 Compatibilidade

- Node.js 18+
- Navegadores modernos (ES2020+)
- TypeScript 5+

---

**Data da implementação:** 2025-12-10
**Status:** ✅ Completo e funcional
