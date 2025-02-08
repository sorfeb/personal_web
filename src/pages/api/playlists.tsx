import { NextApiRequest, NextApiResponse } from 'next';

interface SpotifyError {
  status: number;
  message: string;
}

interface SpotifyPlaylist {
  href: string;
  items: any[]; // You can replace `any` with a specific type if you know the structure of playlist items
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch the token from the `/api/token` route
    const tokenResponse = await fetch('http://localhost:3000/api/token');
    const { access_token }: { access_token: string } = await tokenResponse.json();

    // Spotify user ID
    const userId = '21gpzfq6bukry7svlexbexaya';

    // Fetch playlists using Spotify API
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data: SpotifyPlaylist | SpotifyError = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      const errorData = data as SpotifyError;
      res.status(response.status).json({ error: errorData.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
