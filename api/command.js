import { GoogleGenAI } from '@google/genai';

const shapes = ['sphere', 'torus', 'spiral', 'wave', 'cloud', 'face'];

const schema = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    shape: { type: 'STRING', enum: shapes },
    population: { type: 'INTEGER' },
    energy: { type: 'NUMBER' },
    scale: { type: 'NUMBER' },
    rotationX: { type: 'NUMBER' },
    rotationY: { type: 'NUMBER' },
    rotationZ: { type: 'NUMBER' },
    moveX: { type: 'NUMBER' },
    moveY: { type: 'NUMBER' },
    moveZ: { type: 'NUMBER' },
    color: { type: 'STRING' }
  },
  required: ['reply', 'shape', 'population', 'energy', 'scale', 'rotationX', 'rotationY', 'rotationZ', 'moveX', 'moveY', 'moveZ', 'color'],
  propertyOrdering: ['reply', 'shape', 'population', 'energy', 'scale', 'rotationX', 'rotationY', 'rotationZ', 'moveX', 'moveY', 'moveZ', 'color']
};

const clamp = (value, min, max, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST para enviar um comando.' });
  }

  const message = req.body?.message;
  if (typeof message !== 'string' || !message.trim() || message.length > 1200) {
    return res.status(400).json({ error: 'Informe um comando de até 1200 caracteres.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Configure GEMINI_API_KEY nas variáveis de ambiente do Vercel.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
      contents: [
        'Você é o cérebro de GRID SOUL. O enxame de microcubos é UM ÚNICO CORPO VISUAL.',
        'Escolha uma forma e planeje a transformação espacial solicitada.',
        'Formas permitidas: sphere, torus, spiral, wave, cloud, face.',
        'population: inteiro entre 1000 e 20000; energy: 0 a 1; scale: 0.5 a 8.',
        'rotações em radianos entre -6.28 e 6.28; moveX, moveY, moveZ entre -10 e 10.',
        'color: hexadecimal #RRGGBB. Responda em português. Não produza código executável.',
        'Comando recebido: ' + message.trim()
      ].join('\n'),
      config: { responseMimeType: 'application/json', responseJsonSchema: schema, temperature: 0.5 }
    });

    const p = JSON.parse(result.text);
    const color = typeof p.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(p.color) ? p.color : '#35eaff';
    return res.status(200).json({
      reply: String(p.reply ?? 'Transformação planejada.').slice(0, 700),
      shape: shapes.includes(p.shape) ? p.shape : 'cloud',
      population: Math.round(clamp(p.population, 1000, 20000, 6000)),
      energy: clamp(p.energy, 0, 1, 0.6),
      scale: clamp(p.scale, 0.5, 8, 2),
      rotationX: clamp(p.rotationX, -6.28, 6.28, 0),
      rotationY: clamp(p.rotationY, -6.28, 6.28, 0),
      rotationZ: clamp(p.rotationZ, -6.28, 6.28, 0),
      moveX: clamp(p.moveX, -10, 10, 0),
      moveY: clamp(p.moveY, -10, 10, 0),
      moveZ: clamp(p.moveZ, -10, 10, 0),
      color
    });
  } catch (error) {
    console.error('Gemini API error:', error?.message || error);
    return res.status(502).json({ error: 'Falha ao consultar Gemini. Verifique a chave, o modelo e os limites da API.' });
  }
}
