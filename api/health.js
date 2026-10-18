export default function handler(_req, res) {
  return res.status(200).json({
    ok: true,
    service: 'GRID SOUL Evolution',
    brain: 'Gemini',
    runtime: 'Vercel Functions'
  });
}
