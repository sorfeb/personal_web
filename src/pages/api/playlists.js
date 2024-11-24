// pages/api/playlists.js
export default async function handler(req, res) {
  const tokenResponse = await fetch('http://localhost:3000/api/token');
  const { access_token } = await tokenResponse.json();

  const userId = '21gpzfq6bukry7svlexbexaya';
  const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();

  if (response.ok) {
    res.status(200).json(data);
  } else {
    res.status(response.status).json({ error: data.error });
  }
}
