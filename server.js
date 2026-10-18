import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.error('Configure GEMINI_API_KEY no arquivo .env');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '8kb' }));
app.use('/api/', rateLimit({
  windowMs: 60_000,
  limit: 12
}));

const shapes = [
  'sphere', 'torus', 'spiral', 'wave', 'cloud', 'face'
];

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
  required: [
    'reply', 'shape', 'population', 'energy', 'scale',
    'rotationX', 'rotationY', 'rotationZ',
    'moveX', 'moveY', 'moveZ', 'color'
  ],
  propertyOrdering: [
    'reply', 'shape', 'population', 'energy', 'scale',
    'rotationX', 'rotationY', 'rotationZ',
    'moveX', 'moveY', 'moveZ', 'color'
  ]
};

const clamp = (v, min, max, fallback) => {
  const n = Number(v);
  return Number.isFinite(n)
    ? Math.max(min, Math.min(max, n))
    : fallback;
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'GRID SOUL', brain: 'Gemini' });
});

app.post('/api/command', async (req, res) => {
  const message = req.body?.message;

  if (typeof message !== 'string' ||
      !message.trim() || message.length > 1200) {
    return res.status(400).json({
      error: 'Informe um comando de até 1200 caracteres.'
    });
  }

  try {
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
      contents: [
        'Você é o cérebro de GRID SOUL. O enxame de microcubos é UM ÚNICO CORPO VISUAL.',
        'Escolha uma forma e planeje a transformação espacial solicitada.',
        'Você controla o objetivo geométrico, a população desejada, a energia, a escala, a orientação e a posição global.',
        'Formas permitidas: sphere, torus, spiral, wave, cloud, face.',
        'population: inteiro entre 1000 e 20000.',
        'energy: número de 0 a 1.',
        'scale: número de 0.5 a 8.',
        'rotações em radianos entre -6.28 e 6.28.',
        'moveX, moveY, moveZ: números entre -10 e 10.',
        'color: hexadecimal #RRGGBB.',
        'Responda em português. Não produza código executável. Não alegue controlar hardware externo.',
        'Comando recebido: ' + message.trim()
      ].join('\n'),
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: schema,
        temperature: 0.5
      }
    });

    const p = JSON.parse(result.text);
    const color = /^#[0-9a-fA-F]{6}$/.test(p.color)
      ? p.color : '#35eaff';

    res.json({
      reply: String(p.reply).slice(0, 700),
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
  } catch (err) {
    console.error('Gemini:', err.message);
    res.status(502).json({
      error: 'Falha na API Gemini. Confira a chave, o modelo e a conexão.'
    });
  }
});

app.use(express.static('public'));

app.listen(8765, '127.0.0.1', () => {
  console.log('GRID SOUL: http://127.0.0.1:8765');
  console.log('Cérebro Gemini conectado ao backend.');
});
