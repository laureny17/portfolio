// What Lauren is listening to on Spotify: the current track if something is
// playing, otherwise the most recently played one.
//
// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN
// (see scripts/spotify-auth.mjs). Without them it reports { configured: false }
// and the "listening" row stays hidden.

export const dynamic = "force-dynamic";

export type NowPlaying =
  | { configured: false }
  | {
      configured: true;
      track: {
        title: string;
        artist: string;
        url: string;
        isPlaying: boolean; // false = last played, not current
      } | null;
    };

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const CURRENT_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

// Values pasted into a dashboard often pick up stray whitespace, newlines,
// or surrounding quotes; any of those makes Spotify reject them
const envValue = (name: string) =>
  process.env[name]?.trim().replace(/^(["'])(.*)\1$/, "$2").trim() || undefined;

async function getAccessToken() {
  const id = envValue("SPOTIFY_CLIENT_ID");
  const secret = envValue("SPOTIFY_CLIENT_SECRET");
  const refreshToken = envValue("SPOTIFY_REFRESH_TOKEN");
  if (!id || !secret || !refreshToken) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    // Spotify's error code says which value is wrong (not secret, safe to log):
    // invalid_client -> client ID/secret; invalid_grant -> refresh token
    const detail = await res.text().catch(() => "");
    throw new Error(`Spotify token refresh failed: ${res.status} ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

const toTrack = (t: SpotifyTrack, isPlaying: boolean) => ({
  title: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  url: t.external_urls.spotify,
  isPlaying,
});

const json = (body: NowPlaying, maxAge = 30) =>
  Response.json(body, {
    headers: {
      // Shared cache for a short while so visitors don't each hit Spotify
      "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    },
  });

export async function GET() {
  try {
    const token = await getAccessToken();
    if (!token) return json({ configured: false }, 3600);

    const headers = { Authorization: `Bearer ${token}` };

    // 204 = nothing playing; podcasts etc. come back with item: null or a non-track type
    const current = await fetch(CURRENT_URL, { headers, cache: "no-store" });
    if (current.status === 200) {
      const data = (await current.json()) as {
        is_playing: boolean;
        currently_playing_type: string;
        item: SpotifyTrack | null;
      };
      if (data.is_playing && data.currently_playing_type === "track" && data.item) {
        return json({ configured: true, track: toTrack(data.item, true) });
      }
    }

    const recent = await fetch(RECENT_URL, { headers, cache: "no-store" });
    if (recent.ok) {
      const data = (await recent.json()) as { items: { track: SpotifyTrack }[] };
      const last = data.items[0]?.track;
      return json({ configured: true, track: last ? toTrack(last, false) : null });
    }

    return json({ configured: true, track: null });
  } catch (error) {
    console.error(error);
    return json({ configured: true, track: null }, 10);
  }
}
