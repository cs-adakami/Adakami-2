export default async function handler(req, res) {
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://h5adakami-id.vercel.app';

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { pesan } = req.body || {};

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({
      success: false,
      error: 'Environment variable BOT_TOKEN atau CHAT_ID belum diatur'
    });
  }

  if (!pesan) {
    return res.status(400).json({
      success: false,
      error: 'Field "pesan" wajib diisi'
    });
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: pesan,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({
        success: true,
        message: 'Pesan terkirim ke Telegram'
      });
    }

    return res.status(400).json({
      success: false,
      error: data.description || 'Gagal mengirim pesan ke Telegram'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Kesalahan jaringan atau server'
    });
  }
}
