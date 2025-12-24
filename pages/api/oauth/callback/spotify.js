export default async function handler(req, res) {
  const code = req.query.code;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/oauth/callback/spotify`;

  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  console.log(data); // Aquí verás access_token y refresh_token
  res.send("Autenticación completada, puedes cerrar esta ventana");
}

