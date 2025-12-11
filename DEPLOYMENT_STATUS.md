# 🚀 Status do Deployment

## ✅ Backend (Render)
- **URL:** https://astromatch-7zll.onrender.com
- **Status:** ✅ Online
- **Funcionalidades:**
  - Cálculo preciso de mapas astrais com Swiss Ephemeris
  - API REST com Express
  - Download automático de efemérides

## 🔄 Frontend (Vercel)
- **Deploy:** Automático via GitHub
- **Configuração necessária:**
  - Adicione variável de ambiente `VITE_API_URL=https://astromatch-7zll.onrender.com`

## 📡 Endpoints Disponíveis

### Health Check
```
GET https://astromatch-7zll.onrender.com/health
```

### Calcular Mapa Astral
```
POST https://astromatch-7zll.onrender.com/api/birth-chart
Content-Type: application/json

{
  "year": 1990,
  "month": 3,
  "day": 15,
  "hour": 14,
  "minute": 30,
  "latitude": -23.5505,
  "longitude": -46.6333,
  "timezone": "America/Sao_Paulo"
}
```

### Geocoding (Básico)
```
GET https://astromatch-7zll.onrender.com/api/geocode?city=São Paulo
```

## 🎯 Próximos Passos

1. ✅ Backend rodando no Render
2. ⏳ Configurar variável `VITE_API_URL` no Vercel
3. ⏳ Testar integração frontend + backend

---

**Última atualização:** 2025-12-10
