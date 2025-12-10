/**
 * Servidor Express para API de Mapa Astral
 * =========================================
 *
 * Endpoint: POST /api/birth-chart
 * Body: BirthChartData (JSON)
 * Response: BirthChartResult (JSON)
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { BirthChartData, BirthChartResult } from '../../shared/birthChartTypes';
import { calculateBirthChartPrecise, closeSwissEph } from './birthChartService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Parse JSON no body

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Birth Chart API is running' });
});

/**
 * Endpoint principal: Calcula mapa astral
 */
app.post('/api/birth-chart', async (req: Request, res: Response) => {
  try {
    const data: BirthChartData = req.body;

    // Validação básica
    if (!data.year || !data.month || !data.day) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'É necessário fornecer year, month e day'
      });
    }

    if (!data.latitude || !data.longitude) {
      return res.status(400).json({
        error: 'Localização obrigatória',
        message: 'É necessário fornecer latitude e longitude'
      });
    }

    if (!data.timezone) {
      return res.status(400).json({
        error: 'Timezone obrigatório',
        message: 'É necessário fornecer timezone no formato IANA (ex: "America/Sao_Paulo")'
      });
    }

    // Define valores padrão para hora e minuto se não fornecidos
    const birthData: BirthChartData = {
      ...data,
      hour: data.hour ?? 12, // Meio-dia como padrão
      minute: data.minute ?? 0
    };

    // Calcula o mapa astral
    const result: BirthChartResult = calculateBirthChartPrecise(birthData);

    // Retorna resultado
    return res.json(result);
  } catch (error: any) {
    console.error('Erro ao calcular mapa astral:', error);

    return res.status(500).json({
      error: 'Erro no cálculo',
      message: error.message || 'Erro desconhecido ao calcular mapa astral'
    });
  }
});

/**
 * Endpoint de geocoding (conversão de cidade para lat/lon)
 * Nota: Implementação básica - sugere-se usar serviço externo como Google Geocoding API
 */
app.get('/api/geocode', async (req: Request, res: Response) => {
  const { city } = req.query;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({
      error: 'Cidade obrigatória',
      message: 'Forneça o parâmetro "city" na query string'
    });
  }

  // IMPLEMENTAÇÃO FUTURA: integrar com API de geocoding
  // Por enquanto, retorna coordenadas de algumas cidades brasileiras comuns
  const cityCoordinates: Record<string, { lat: number; lon: number; timezone: string }> = {
    'São Paulo': { lat: -23.5505, lon: -46.6333, timezone: 'America/Sao_Paulo' },
    'Rio de Janeiro': { lat: -22.9068, lon: -43.1729, timezone: 'America/Sao_Paulo' },
    'Brasília': { lat: -15.7942, lon: -47.8822, timezone: 'America/Sao_Paulo' },
    'Salvador': { lat: -12.9714, lon: -38.5014, timezone: 'America/Bahia' },
    'Fortaleza': { lat: -3.7172, lon: -38.5433, timezone: 'America/Fortaleza' },
    'Belo Horizonte': { lat: -19.9167, lon: -43.9345, timezone: 'America/Sao_Paulo' },
    'Manaus': { lat: -3.1190, lon: -60.0217, timezone: 'America/Manaus' },
    'Curitiba': { lat: -25.4284, lon: -49.2733, timezone: 'America/Sao_Paulo' },
    'Recife': { lat: -8.0476, lon: -34.8770, timezone: 'America/Recife' },
    'Porto Alegre': { lat: -30.0346, lon: -51.2177, timezone: 'America/Sao_Paulo' }
  };

  const normalized = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const found = Object.keys(cityCoordinates).find(
    key => key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === normalized.toLowerCase()
  );

  if (found) {
    return res.json(cityCoordinates[found]);
  }

  return res.status(404).json({
    error: 'Cidade não encontrada',
    message: `Não foi possível encontrar coordenadas para "${city}". Sugestão: use uma API de geocoding externa.`
  });
});

// Inicia o servidor
const server = app.listen(PORT, () => {
  console.log(`🌟 Birth Chart API rodando em http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/birth-chart - Calcula mapa astral`);
  console.log(`   GET  /api/geocode?city=... - Geocoding (básico)`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Encerrando servidor...');
  closeSwissEph();
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nEncerrando servidor...');
  closeSwissEph();
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

export default app;
