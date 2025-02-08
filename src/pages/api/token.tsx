import { NextApiRequest, NextApiResponse } from 'next';

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyError {
  error: string;
  error_description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.status(500).json({ error: 'Missing Spotify client credentials' });
      return;
    }

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authString}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    const data: SpotifyToken | SpotifyError = await response.json();

    if (response.ok) {
      const tokenData = data as SpotifyToken;
      res.status(200).json(tokenData);
    } else {
      const errorData = data as SpotifyError;
      res.status(response.status).json({ error: errorData.error_description });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
