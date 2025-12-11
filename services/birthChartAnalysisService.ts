/**
 * Serviço para gerar análise de Mapa Astral com GPT-4 mini
 */

import type { BirthChartResult } from '../shared/birthChartTypes';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Gera interpretação completa do mapa astral usando GPT-4 mini
 */
export async function generateBirthChartAnalysis(
  result: BirthChartResult,
  name?: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('Chave da API OpenAI não configurada');
  }

  const prompt = `Você é um astrólogo profissional experiente. Analise este mapa astral completo de forma detalhada e profissional.

${name ? `Nome: ${name}\n` : ''}
**ASCENDENTE:** ${result.ascendant.sign} ${result.ascendant.degree.toFixed(2)}°
**MEIO DO CÉU (MC):** ${result.midheaven.sign} ${result.midheaven.degree.toFixed(2)}°

**PLANETAS:**
${result.planets.map(p =>
  `- ${p.name}: ${p.sign} ${p.degree.toFixed(2)}° (Casa ${p.house})${p.retrograde ? ' ℞ RETRÓGRADO' : ''}`
).join('\n')}

**CASAS:**
${result.houses.map(h =>
  `Casa ${h.number}: ${h.sign} ${h.degree.toFixed(2)}°`
).join('\n')}

**ASPECTOS PRINCIPAIS:**
${result.aspects.slice(0, 15).map(a =>
  `${a.planet1} ${a.type} ${a.planet2} (orbe: ${a.orb}°)`
).join('\n')}

**ELEMENTOS:**
Fogo: ${result.elements.fire} | Terra: ${result.elements.earth} | Ar: ${result.elements.air} | Água: ${result.elements.water}

**MODALIDADES:**
Cardinal: ${result.modalities.cardinal} | Fixo: ${result.modalities.fixed} | Mutável: ${result.modalities.mutable}

Forneça uma análise completa e estruturada em português brasileiro com:

1. **VISÃO GERAL** - Descrição da personalidade geral baseada no Sol, Lua e Ascendente
2. **IDENTIDADE E EGO** - Análise do Sol e sua posição
3. **EMOÇÕES E INSTINTOS** - Análise da Lua e sua posição
4. **ASCENDENTE** - Como a pessoa se apresenta ao mundo
5. **COMUNICAÇÃO** - Mercúrio e seus aspectos
6. **AMOR E RELACIONAMENTOS** - Vênus e seus aspectos
7. **AÇÃO E ENERGIA** - Marte e seus aspectos
8. **EXPANSÃO E CRESCIMENTO** - Júpiter
9. **DESAFIOS E ESTRUTURA** - Saturno
10. **TRANSFORMAÇÃO** - Planetas exteriores (Urano, Netuno, Plutão)
11. **PRINCIPAIS ASPECTOS** - Interpretação dos aspectos mais relevantes
12. **ELEMENTOS E MODALIDADES** - O que a distribuição revela
13. **CASAS IMPORTANTES** - Foco nas casas com mais planetas
14. **ORIENTAÇÕES** - Conselhos práticos baseados no mapa

Use linguagem profissional mas acessível. Seja detalhado, positivo e construtivo.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um astrólogo profissional experiente. Forneça análises detalhadas e precisas de mapas astrais, sem mencionar que é uma inteligência artificial ou sistema automatizado.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro ao gerar análise');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Erro ao gerar análise com GPT-4:', error);
    throw new Error('Não foi possível gerar a análise. Tente novamente.');
  }
}

/**
 * Gera PDF do mapa astral com análise completa
 */
export function generatePDF(
  result: BirthChartResult,
  analysis: string,
  name?: string,
  birthData?: { date: string; time: string; city: string }
): void {
  // Criar conteúdo HTML para o PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mapa Astral${name ? ` - ${name}` : ''}</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #ffffff;
    }
    h1 {
      color: #4a148c;
      text-align: center;
      font-size: 32px;
      margin-bottom: 10px;
      border-bottom: 3px solid #7b1fa2;
      padding-bottom: 15px;
    }
    h2 {
      color: #6a1b9a;
      font-size: 24px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-left: 4px solid #9c27b0;
      padding-left: 15px;
    }
    h3 {
      color: #7b1fa2;
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding: 20px;
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      border-radius: 10px;
    }
    .birth-info {
      font-size: 14px;
      color: #666;
      margin-top: 10px;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      background: #fafafa;
      border-radius: 8px;
      border-left: 4px solid #9c27b0;
    }
    .planet-list, .house-list, .aspect-list {
      display: grid;
      gap: 10px;
      margin: 15px 0;
    }
    .planet-item, .house-item, .aspect-item {
      padding: 12px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      font-size: 14px;
    }
    .retrograde {
      color: #d32f2f;
      font-weight: bold;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    .stat-box {
      padding: 15px;
      background: white;
      border-radius: 8px;
      border: 2px solid #9c27b0;
    }
    .stat-title {
      font-weight: bold;
      color: #6a1b9a;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .analysis {
      white-space: pre-wrap;
      line-height: 1.9;
      font-size: 15px;
      color: #333;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌟 MAPA ASTRAL 🌟</h1>
    ${name ? `<h2>${name}</h2>` : ''}
    ${birthData ? `
      <div class="birth-info">
        ${birthData.date} às ${birthData.time}<br>
        ${birthData.city}
      </div>
    ` : ''}
  </div>

  <div class="section">
    <h2>📍 PONTOS PRINCIPAIS</h2>
    <div class="stats">
      <div class="stat-box">
        <div class="stat-title">Ascendente</div>
        ${result.ascendant.sign} ${result.ascendant.degree.toFixed(2)}°
      </div>
      <div class="stat-box">
        <div class="stat-title">Meio do Céu (MC)</div>
        ${result.midheaven.sign} ${result.midheaven.degree.toFixed(2)}°
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🪐 PLANETAS</h2>
    <div class="planet-list">
      ${result.planets.map(p => `
        <div class="planet-item">
          <strong>${p.name}:</strong> ${p.sign} ${p.degree.toFixed(2)}°
          (Casa ${p.house})${p.retrograde ? ' <span class="retrograde">℞ RETRÓGRADO</span>' : ''}
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>🏠 CASAS</h2>
    <div class="house-list">
      ${result.houses.map(h => `
        <div class="house-item">
          <strong>Casa ${h.number}:</strong> ${h.sign} ${h.degree.toFixed(2)}°
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>✨ ASPECTOS PRINCIPAIS</h2>
    <div class="aspect-list">
      ${result.aspects.slice(0, 20).map(a => `
        <div class="aspect-item">
          ${a.planet1} <strong>${a.type}</strong> ${a.planet2} (orbe: ${a.orb.toFixed(2)}°)
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>🔥 ELEMENTOS E MODALIDADES</h2>
    <div class="stats">
      <div class="stat-box">
        <div class="stat-title">Elementos</div>
        Fogo: ${result.elements.fire}<br>
        Terra: ${result.elements.earth}<br>
        Ar: ${result.elements.air}<br>
        Água: ${result.elements.water}
      </div>
      <div class="stat-box">
        <div class="stat-title">Modalidades</div>
        Cardinal: ${result.modalities.cardinal}<br>
        Fixo: ${result.modalities.fixed}<br>
        Mutável: ${result.modalities.mutable}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>📖 ANÁLISE COMPLETA</h2>
    <div class="analysis">${analysis}</div>
  </div>

  <div class="footer">
    Mapa Astral calculado por Signos Animados<br>
    Data de geração: ${new Date().toLocaleDateString('pt-BR')}
  </div>
</body>
</html>
  `;

  // Criar blob e fazer download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mapa-astral${name ? `-${name.replace(/\s+/g, '-')}` : ''}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
