// pages/api/token.js
export default async function handler(req, res) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
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
  
    const data = await response.json();
  
    if (response.ok) {
      res.status(200).json(data); 
    } else {
      res.status(response.status).json({ error: data.error });
    }
  }
  