export default async function handler(req, res) {
  const { user_id } = req.query;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/oauth/callback/spotify`;
  const scopes = "user-read-playback-state user-read-currently-playing";

  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  res.redirect(url);
}
