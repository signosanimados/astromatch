# 🌟 Guia Completo: Mapa Astral Profissional com Swiss Ephemeris

Este guia mostra como usar o sistema completo de cálculo preciso de mapas astrais.

## 📂 Estrutura do Projeto

```
astromatch/
├── shared/
│   └── birthChartTypes.ts          # Tipos compartilhados (frontend + backend)
│
├── backend/                         # API Node.js + Swiss Ephemeris
│   ├── src/
│   │   ├── server.ts                # Servidor Express
│   │   ├── birthChartService.ts     # Lógica Swiss Ephemeris
│   │   └── utils/
│   │       └── helpers.ts           # Funções auxiliares
│   ├── ephe/                        # Efemérides (.se1 files)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── services/
│   └── birthChartApiService.ts      # Cliente API (frontend)
│
├── components/
│   ├── BirthChart.tsx               # Componente original (Gemini)
│   └── BirthChartPrecise.tsx        # Novo componente (Swiss Ephemeris)
│
└── .env.example
```

## 🚀 Instalação Passo a Passo

### 1. Instalar dependências do Backend

```bash
cd backend
npm install
```

### 2. Baixar Efemérides (OBRIGATÓRIO)

Os arquivos de efemérides são essenciais para os cálculos astronômicos.

**Opção A: Download automático com wget**

```bash
cd backend
mkdir -p ephe
cd ephe

# Baixar efemérides do servidor oficial
wget https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1
wget https://www.astro.com/ftp/swisseph/ephe/semo_18.se1
wget https://www.astro.com/ftp/swisseph/ephe/seas_18.se1

cd ../..
```

**Opção B: Download manual**

1. Acesse: https://www.astro.com/ftp/swisseph/ephe/
2. Baixe:
   - `sepl_18.se1` (planetas - **obrigatório**)
   - `semo_18.se1` (lua - **obrigatório**)
   - `seas_18.se1` (asteroides - opcional)
3. Coloque os arquivos em `backend/ephe/`

### 3. Configurar variáveis de ambiente

**Backend:**
```bash
cd backend
cp .env.example .env
# Edite .env se necessário (porta, etc.)
```

**Frontend:**
```bash
cd ..
cp .env.example .env
# Ajuste VITE_API_URL se necessário
```

### 4. Iniciar o Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

Você deve ver:
```
🌟 Birth Chart API rodando em http://localhost:3001
📍 Endpoints:
   GET  /health - Health check
   POST /api/birth-chart - Calcula mapa astral
   GET  /api/geocode?city=... - Geocoding (básico)
```

### 5. Iniciar o Frontend

Em outro terminal:

```bash
# Na raiz do projeto (não dentro de backend/)
npm run dev
```

## 🧪 Testando o Sistema

### Teste 1: Verificar se o backend está rodando

```bash
curl http://localhost:3001/health
```

Deve retornar:
```json
{"status":"ok","message":"Birth Chart API is running"}
```

### Teste 2: Calcular um mapa astral via curl

```bash
curl -X POST http://localhost:3001/api/birth-chart \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "year": 1990,
    "month": 3,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "latitude": -23.5505,
    "longitude": -46.6333,
    "timezone": "America/Sao_Paulo"
  }'
```

### Teste 3: Usar o componente no frontend

Você tem duas opções:

**Opção A: Usar o novo componente BirthChartPrecise**

No seu `App.tsx`, importe e use:

```tsx
import BirthChartPrecise from './components/BirthChartPrecise';

// Use assim:
<BirthChartPrecise onBack={() => setScreen('home')} />
```

**Opção B: Integrar com o componente existente BirthChart**

Você pode modificar o `BirthChart.tsx` existente para também calcular o mapa preciso antes de enviar para o Gemini:

```tsx
// No BirthChart.tsx, adicione:
import { calculateBirthChartApi, parseBirthData } from '../services/birthChartApiService';

// Dentro de handleSubmit, antes de chamar o Gemini:
try {
  const birthData = parseBirthData(
    birthDate,
    birthTime,
    latitude,
    longitude,
    'America/Sao_Paulo', // ou detecte o timezone
    name,
    city
  );

  // Calcula mapa preciso
  const preciseChart = await calculateBirthChartApi(birthData);

  // Agora você tem o mapa preciso em `preciseChart`
  // Pode exibir ou enviar para o Gemini junto com o prompt

  const result = await generateBirthChart({
    name,
    date: birthDate,
    time: birthTime,
    city,
    preciseChart // Opcional: envie o mapa para o Gemini analisar
  });

  setReading(result);
} catch (err) {
  // ...
}
```

## 📊 Entendendo os Dados Retornados

### Estrutura do BirthChartResult

```typescript
{
  "planets": [
    {
      "name": "Sol",              // Nome do planeta
      "sign": "Peixes",           // Signo
      "degree": 24.5678,          // Graus dentro do signo (0-30)
      "house": 10,                // Casa astrológica (1-12)
      "retrograde": false,        // Se está retrógrado
      "longitude": 354.5678       // Longitude eclíptica absoluta (0-360)
    }
    // ... outros 9 planetas
  ],

  "houses": [
    {
      "number": 1,                // Número da casa
      "sign": "Gêmeos",          // Signo na cúspide
      "degree": 15.234,           // Graus
      "longitude": 75.234         // Longitude absoluta
    }
    // ... outras 11 casas
  ],

  "ascendant": {
    "sign": "Gêmeos",
    "degree": 15.234,
    "longitude": 75.234
  },

  "midheaven": {
    "sign": "Aquário",
    "degree": 20.567,
    "longitude": 320.567
  },

  "aspects": [
    {
      "planet1": "Sol",
      "planet2": "Lua",
      "type": "Trígono",          // Tipo do aspecto
      "angle": 120,               // Ângulo (0, 60, 90, 120, 180)
      "orb": 2.34,                // Orbe (diferença do ângulo exato)
      "nature": "harmonic"        // harmonic | challenging | neutral
    }
    // ... outros aspectos
  ],

  "elements": {
    "fire": 2,                    // Planetas em signos de Fogo
    "earth": 1,                   // Terra
    "air": 2,                     // Ar
    "water": 1                    // Água
  },

  "modalities": {
    "cardinal": 2,                // Planetas em signos Cardinais
    "fixed": 2,                   // Fixos
    "mutable": 2                  // Mutáveis
  },

  "calculatedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🌍 Timezones e Coordenadas

### Timezones IANA (exemplos brasileiros)

- `America/Sao_Paulo` - SP, RJ, MG, PR, SC, RS, DF, GO, ES
- `America/Manaus` - AM, RR, RO, AC (parte)
- `America/Fortaleza` - CE, MA, PI, RN, PB
- `America/Bahia` - BA, SE, AL
- `America/Recife` - PE
- `America/Noronha` - Fernando de Noronha

Lista completa: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Obtendo Coordenadas

**API de Geocoding (recomendado para produção):**

- Google Geocoding API: https://developers.google.com/maps/documentation/geocoding
- OpenCage API: https://opencagedata.com/
- Nominatim (OSM): https://nominatim.org/

**Usando o geocoding básico incluído:**

```typescript
import { geocodeCity } from './services/birthChartApiService';

const coords = await geocodeCity('São Paulo');
// { lat: -23.5505, lon: -46.6333, timezone: 'America/Sao_Paulo' }
```

## 🎨 Customizações

### Adicionar mais cidades no geocoding básico

Edite `backend/src/server.ts`, linha ~80:

```typescript
const cityCoordinates: Record<string, { lat: number; lon: number; timezone: string }> = {
  'São Paulo': { lat: -23.5505, lon: -46.6333, timezone: 'America/Sao_Paulo' },
  'Sua Cidade': { lat: -00.0000, lon: -00.0000, timezone: 'America/Sao_Paulo' },
  // ... adicione mais
};
```

### Mudar sistema de casas

Por padrão usa Placidus ('P'). Para mudar, edite `backend/src/birthChartService.ts`, linha ~130:

```typescript
const houseSystem = 'P'; // 'P' = Placidus, 'K' = Koch, 'E' = Equal, etc.
```

Sistemas disponíveis:
- `P` - Placidus (padrão)
- `K` - Koch
- `E` - Equal (casas iguais)
- `W` - Whole Sign
- `R` - Regiomontanus
- `C` - Campanus

### Adicionar mais aspectos

Edite `backend/src/birthChartService.ts`, linha ~50:

```typescript
const ASPECT_DEFINITIONS: AspectDefinition[] = [
  { name: 'Conjunção', angle: 0, orb: 8, nature: 'neutral' },
  { name: 'Sextil', angle: 60, orb: 6, nature: 'harmonic' },
  { name: 'Quadratura', angle: 90, orb: 7, nature: 'challenging' },
  { name: 'Trígono', angle: 120, orb: 8, nature: 'harmonic' },
  { name: 'Oposição', angle: 180, orb: 8, nature: 'challenging' },
  // Adicione mais:
  { name: 'Semisextil', angle: 30, orb: 2, nature: 'neutral' },
  { name: 'Quincúncio', angle: 150, orb: 3, nature: 'challenging' },
];
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'swisseph'"

```bash
cd backend
npm install swisseph --save
```

### Erro: "Cannot find ephemeris files"

- Verifique se os arquivos `.se1` estão em `backend/ephe/`
- Redownload: veja seção "Baixar Efemérides"

### Erro: "Invalid timezone"

- Use timezone IANA: `America/Sao_Paulo` (não `BRT` ou `GMT-3`)
- Veja lista: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### API retorna 404

- Certifique-se de que o backend está rodando (`npm run dev` em `backend/`)
- Verifique a URL em `.env`: `VITE_API_URL=http://localhost:3001`

### CORS Error

- Backend já está configurado com CORS aberto
- Se precisar restringir, edite `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'https://seu-dominio.com']
}));
```

## 🚀 Deploy

### Backend (Produção)

1. **Build:**
   ```bash
   cd backend
   npm run build
   ```

2. **Copie arquivos para servidor:**
   ```bash
   dist/
   ephe/
   package.json
   .env
   ```

3. **No servidor:**
   ```bash
   npm install --production
   PORT=3001 npm start
   ```

4. **Recomendado:** Use PM2 ou similar:
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name astromatch-api
   pm2 save
   pm2 startup
   ```

### Frontend (Produção)

1. **Configurar URL da API:**
   ```bash
   echo "VITE_API_URL=https://sua-api.com" > .env.production
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy** `dist/` para Vercel, Netlify, etc.

## 📖 Referências

- [Swiss Ephemeris](https://www.astro.com/swisseph/)
- [Astro.com Chart Drawing](https://www.astro.com/cgi/chart.cgi) - Para comparar resultados
- [Luxon Documentation](https://moment.github.io/luxon/)
- [IANA Timezones](https://www.iana.org/time-zones)

## 🆘 Suporte

- **Backend:** Veja `backend/README.md`
- **Issues:** Abra issue no GitHub
- **Dúvidas:** Consulte documentação do Swiss Ephemeris

---

**Desenvolvido com ❤️ para cálculos astrológicos precisos**
