# 🌟 AstroMatch Backend - API de Mapa Astral

Backend profissional para cálculo preciso de Mapas Astrais usando **Swiss Ephemeris**.

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Baixar arquivos de efemérides (OBRIGATÓRIO)

Os arquivos de efemérides são necessários para os cálculos astronômicos precisos.

**Opção A: Download direto** (Recomendado)

```bash
# Criar diretório ephe se não existir
mkdir -p ephe

# Baixar efemérides do servidor oficial Swiss Ephemeris
cd ephe
wget https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1
wget https://www.astro.com/ftp/swisseph/ephe/semo_18.se1
wget https://www.astro.com/ftp/swisseph/ephe/seas_18.se1
cd ..
```

**Opção B: Download manual**

1. Acesse: https://www.astro.com/ftp/swisseph/ephe/
2. Baixe os seguintes arquivos:
   - `sepl_18.se1` (planetas)
   - `semo_18.se1` (lua)
   - `seas_18.se1` (asteroides - opcional)
3. Coloque-os na pasta `backend/ephe/`

> **Importante**: Sem esses arquivos, o servidor não conseguirá calcular os mapas!

### 3. Configurar variáveis de ambiente (opcional)

```bash
cp .env.example .env
# Edite .env se necessário
```

## 🏃 Executando

### Modo desenvolvimento (com hot reload)

```bash
npm run dev
```

### Build e produção

```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 📡 Endpoints da API

### 1. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Birth Chart API is running"
}
```

### 2. Calcular Mapa Astral

```http
POST /api/birth-chart
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Maria Silva",
  "year": 1990,
  "month": 3,
  "day": 15,
  "hour": 14,
  "minute": 30,
  "latitude": -23.5505,
  "longitude": -46.6333,
  "timezone": "America/Sao_Paulo",
  "city": "São Paulo, SP"
}
```

**Response:**
```json
{
  "planets": [
    {
      "name": "Sol",
      "sign": "Peixes",
      "degree": 24.5678,
      "house": 10,
      "retrograde": false,
      "longitude": 354.5678
    }
    // ... outros planetas
  ],
  "houses": [
    {
      "number": 1,
      "sign": "Gêmeos",
      "degree": 15.234,
      "longitude": 75.234
    }
    // ... outras casas
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
      "type": "Trígono",
      "angle": 120,
      "orb": 2.34,
      "nature": "harmonic"
    }
    // ... outros aspectos
  ],
  "elements": {
    "fire": 2,
    "earth": 1,
    "air": 2,
    "water": 1
  },
  "modalities": {
    "cardinal": 2,
    "fixed": 2,
    "mutable": 2
  },
  "calculatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 3. Geocoding (Básico)

```http
GET /api/geocode?city=São Paulo
```

**Response:**
```json
{
  "lat": -23.5505,
  "lon": -46.6333,
  "timezone": "America/Sao_Paulo"
}
```

> **Nota**: O geocoding atual é limitado a algumas cidades brasileiras. Para produção, recomenda-se integrar com Google Geocoding API ou similar.

## 🧪 Testando a API

### Com curl:

```bash
curl -X POST http://localhost:3001/api/birth-chart \
  -H "Content-Type: application/json" \
  -d '{
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

### Com JavaScript/Frontend:

```typescript
const response = await fetch('http://localhost:3001/api/birth-chart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    year: 1990,
    month: 3,
    day: 15,
    hour: 14,
    minute: 30,
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo'
  })
});

const birthChart = await response.json();
console.log(birthChart);
```

## 📚 Estrutura do Projeto

```
backend/
├── src/
│   ├── server.ts              # Servidor Express
│   ├── birthChartService.ts   # Lógica Swiss Ephemeris
│   └── utils/
│       └── helpers.ts          # Funções auxiliares
├── ephe/                       # Efemérides (arquivos .se1)
├── dist/                       # Build (gerado)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Troubleshooting

### Erro: "Cannot find ephemeris files"

- Verifique se os arquivos `.se1` estão na pasta `backend/ephe/`
- Baixe os arquivos conforme instruções acima

### Erro: "Invalid timezone"

- Use timezone no formato IANA: `"America/Sao_Paulo"`, não `"BRT"` ou `"GMT-3"`
- Lista completa: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Porta 3001 já em uso

- Altere a porta no `.env`: `PORT=3002`
- Ou mate o processo: `lsof -ti:3001 | xargs kill`

## 📖 Referências

- [Swiss Ephemeris](https://www.astro.com/swisseph/)
- [Luxon (Timezone)](https://moment.github.io/luxon/)
- [Express.js](https://expressjs.com/)

## 🤝 Contribuindo

Para contribuir, abra uma issue ou pull request.

## 📄 Licença

MIT
