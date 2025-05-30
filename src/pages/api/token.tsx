import { NextApiRequest, NextApiResponse } from 'next';

let accessToken: string | null = null;
let expiresAt: number | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretKey = req.headers['x-api-key'];
  const serverSecret = process.env.INTERNAL_API_SECRET; 

  if (!serverSecret || secretKey !== serverSecret) {
    return res.status(403).json({ error: 'Unauthorized request' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing Spotify client credentials' });
  }

  const now = Date.now();

  if (accessToken && expiresAt && now < expiresAt) {
    return res.status(200).json({ access_token: accessToken });
  }

  const tokenUrl = process.env.SPOTIFY_TOKEN_URL;
  if (!tokenUrl) {
    return res.status(500).json({ error: 'Missing Spotify token URL' });
  }

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  const data = await response.json();

  if (response.ok) {
    accessToken = data.access_token;
    expiresAt = now + data.expires_in * 1000;
    return res.status(200).json({ access_token: accessToken });
  } else {
    return res.status(response.status).json({ error: data.error });
  }
}