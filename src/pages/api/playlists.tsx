import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Securely fetch the token using the internal API key
    const tokenResponse = await fetch('http://localhost:3000/api/token', {
      headers: { 'x-api-key': process.env.INTERNAL_API_SECRET || '' }
    });

    const { access_token }: { access_token: string } = await tokenResponse.json();

    if (!access_token) {
      return res.status(500).json({ error: 'Failed to get access token' });
    }

    const userId = '21gpzfq6bukry7svlexbexaya';

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: data.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
