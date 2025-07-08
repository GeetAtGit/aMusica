const CORS_PROXY = "/.netlify/functions/deezer?url=";

export async function getTrendingTracks(limit = 50) {
  const encodedUrl = encodeURIComponent(`https://api.deezer.com/editorial/0/charts?limit=${limit}`);
  const res = await fetch(`${CORS_PROXY}${encodedUrl}`);
  const json = await res.json();
  return json.tracks.data.slice(0, limit);
}

export async function getTopChartPlaylists() {
  const encodedUrl = encodeURIComponent(`https://api.deezer.com/chart`);
  const res = await fetch(`${CORS_PROXY}${encodedUrl}`);
  const json = await res.json();
  return json.playlists?.data || [];
}

export async function getPlaylistById(playlistId) {
  const encodedUrl = encodeURIComponent(`https://api.deezer.com/playlist/${playlistId}`);
  const res = await fetch(`${CORS_PROXY}${encodedUrl}`);
  if (!res.ok) throw new Error("Failed to fetch playlist");
  const json = await res.json();
  return json;
}
