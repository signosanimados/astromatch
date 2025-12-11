/**
 * Servidor Express para API de Mapa Astral
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { calculateBirthChartPrecise } from './birthChartService';
import { BirthChartData } from './types/birthChartTypes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

/**
 * Health check
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Birth Chart API is running' });
});

/**
 * Endpoint principal: calcular mapa astral
 */
app.post('/api/birth-chart', (req: Request, res: Response) => {
  try {
    const data: BirthChartData = req.body;

    // Validar campos obrigatórios
    if (!data.year || !data.month || !data.day ||
        data.hour === undefined || data.minute === undefined ||
        data.latitude === undefined || data.longitude === undefined ||
        !data.timezone) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        required: ['year', 'month', 'day', 'hour', 'minute', 'latitude', 'longitude', 'timezone']
      });
    }

    // Calcular mapa astral
    const result = calculateBirthChartPrecise(data);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({
      error: 'Erro ao calcular mapa astral',
      message: error.message
    });
  }
});

/**
 * Geocoding básico para cidades brasileiras
 */
app.get('/api/geocode', (req: Request, res: Response) => {
  const city = req.query.city as string;

  const cities: Record<string, { lat: number; lng: number; timezone: string }> = {
    'São Paulo': { lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo' },
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729, timezone: 'America/Sao_Paulo' },
    'Brasília': { lat: -15.7939, lng: -47.8828, timezone: 'America/Sao_Paulo' },
    'Salvador': { lat: -12.9714, lng: -38.5014, timezone: 'America/Bahia' },
    'Fortaleza': { lat: -3.7172, lng: -38.5434, timezone: 'America/Fortaleza' },
    'Belo Horizonte': { lat: -19.9167, lng: -43.9345, timezone: 'America/Sao_Paulo' },
    'Manaus': { lat: -3.1190, lng: -60.0217, timezone: 'America/Manaus' },
    'Curitiba': { lat: -25.4284, lng: -49.2733, timezone: 'America/Sao_Paulo' },
    'Recife': { lat: -8.0476, lng: -34.8770, timezone: 'America/Recife' },
    'Porto Alegre': { lat: -30.0346, lng: -51.2177, timezone: 'America/Sao_Paulo' }
  };

  if (!city) {
    return res.status(400).json({ error: 'Parâmetro city é obrigatório' });
  }

  const cityData = cities[city];
  if (!cityData) {
    return res.status(404).json({ error: 'Cidade não encontrada' });
  }

  res.json({
    city,
    latitude: cityData.lat,
    longitude: cityData.lng,
    timezone: cityData.timezone
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌟 Birth Chart API rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
