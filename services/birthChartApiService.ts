/**
 * Serviço para comunicação com a API de Mapa Astral
 */

import type {
  BirthChartData,
  BirthChartResult
} from '../shared/birthChartTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://astromatch-7zll.onrender.com';

/**
 * Calcular mapa astral via API backend
 */
export async function calculateBirthChartApi(data: BirthChartData): Promise<BirthChartResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/birth-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao calcular mapa astral');
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error('Erro na API de mapa astral:', error);
    throw new Error(error.message || 'Não foi possível calcular o mapa astral');
  }
}

/**
 * Obter coordenadas de uma cidade
 */
export async function geocodeCity(city: string): Promise<{
  latitude: number;
  longitude: number;
  timezone: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/geocode?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      throw new Error('Cidade não encontrada');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Cidade não encontrada: ${city}`);
  }
}

/**
 * Verificar status da API
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    return false;
  }
}
