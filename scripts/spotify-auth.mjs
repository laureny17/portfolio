// One-time helper to get a Spotify refresh token for /api/now-playing.
//
// 1. Create an app at https://developer.spotify.com/dashboard
//    - Redirect URI: http://127.0.0.1:8888/callback
//    - API: Web API
// 2. Put its client ID and secret in .env.local (see .env.example)
// 3. Run: node --env-file=.env.local scripts/spotify-auth.mjs
// 4. Open the printed link, approve, and copy the refresh token it prints
//    into .env.local and into your Vercel project's environment variables.

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const port = 8888;
const redirectUri = `http://127.0.0.1:${port}/callback`;
const state = randomBytes(16).toString("hex");
const scope = "user-read-currently-playing user-read-recently-played";

const authorizeUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope,
    state,
  });

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", redirectUri);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  if (url.searchParams.get("state") !== state || !url.searchParams.get("code")) {
    res.writeHead(400).end("Authorization failed or was cancelled.");
    console.error("Authorization failed:", url.searchParams.get("error") ?? "bad state");
    server.close();
    return;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: url.searchParams.get("code"),
      redirect_uri: redirectUri,
    }),
  });
  const data = await tokenRes.json();

  if (!data.refresh_token) {
    res.writeHead(500).end("Token exchange failed; see terminal.");
    console.error("Token exchange failed:", data);
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Done! You can close this tab.");
    console.log("\nSPOTIFY_REFRESH_TOKEN=" + data.refresh_token + "\n");
  }
  server.close();
});

server.listen(port, "127.0.0.1", () => {
  console.log("Open this link and approve access:\n\n" + authorizeUrl + "\n");
});
