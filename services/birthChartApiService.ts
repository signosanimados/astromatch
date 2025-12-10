/**
 * Serviço frontend para comunicação com a API de Mapa Astral
 * ============================================================
 *
 * Este serviço abstrai as chamadas HTTP para o backend que usa Swiss Ephemeris
 */

import type {
  BirthChartData,
  BirthChartResult
} from '../shared/birthChartTypes';

// URL base da API (ajuste conforme necessário)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Converte cidade em coordenadas (geocoding básico)
 */
export async function geocodeCity(city: string): Promise<{
  lat: number;
  lon: number;
  timezone: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/geocode?city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      throw new Error('Cidade não encontrada');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar coordenadas da cidade:', error);
    throw new Error(
      'Não foi possível encontrar coordenadas para esta cidade. Por favor, forneça latitude/longitude manualmente.'
    );
  }
}

/**
 * Calcula mapa astral preciso usando o backend
 */
export async function calculateBirthChartApi(
  data: BirthChartData
): Promise<BirthChartResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/birth-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao calcular mapa astral');
    }

    const result: BirthChartResult = await response.json();
    return result;
  } catch (error: any) {
    console.error('Erro ao calcular mapa astral:', error);
    throw new Error(
      error.message || 'Não foi possível calcular o mapa astral. Tente novamente.'
    );
  }
}

/**
 * Verifica se a API está online
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Helper: converte string de data/hora HTML para objeto BirthChartData
 */
export function parseBirthData(
  dateStr: string, // formato: "YYYY-MM-DD"
  timeStr: string, // formato: "HH:MM"
  latitude: number,
  longitude: number,
  timezone: string,
  name?: string,
  city?: string
): BirthChartData {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  return {
    name,
    year,
    month,
    day,
    hour,
    minute,
    latitude,
    longitude,
    timezone,
    city
  };
}
