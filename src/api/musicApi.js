const CORS_PROXY = "http://localhost:8080/";

export async function getTrendingTracks(limit = 50) {
  const res = await fetch(`${CORS_PROXY}https://api.deezer.com/editorial/0/charts?limit=${limit}`);
  const json = await res.json();
  return json.tracks.data.slice(0, limit);
}

export async function getTopChartPlaylists() {
  const res = await fetch(`${CORS_PROXY}https://api.deezer.com/chart`);
  const json = await res.json();
  return json.playlists?.data || [];
}

export async function getPlaylistById(playlistId) {
  const res = await fetch(`${CORS_PROXY}https://api.deezer.com/playlist/${playlistId}`);
  if (!res.ok) throw new Error("Failed to fetch playlist");
  const json = await res.json();
  return json; // includes title, picture, tracks.data etc.
}
