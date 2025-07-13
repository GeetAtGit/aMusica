// The URL for our new Netlify Function
const DEEZER_PROXY_URL = "/.netlify/functions/deezer-proxy";

// Helper to make requests through our Deezer proxy
async function deezerFetch(deezerPath, params = {}) {
  const queryParams = new URLSearchParams(params);
  queryParams.set('deezerPath', deezerPath);

  const response = await fetch(`${DEEZER_PROXY_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Failed to fetch from Deezer API: ${response.status}`);
  }
  return response.json();
}

// Helper to re-shape Deezer track data into the format our components expect
const normalizeTrack = (track) => {
  if (!track) return null;
  return {
    id: track.id,
    title: track.title,
    artist: track.artist, // ✅ CORRECTED: Pass the original artist object
    album: track.album,   // ✅ CORRECTED: Pass the original album object
    preview: track.preview,
  };
};

// Helper to re-shape Deezer playlist data
const normalizePlaylist = (playlist) => {
  if (!playlist) return null;
  return {
    id: playlist.id,
    title: playlist.title,
    picture_medium: playlist.picture_medium,
  };
};

/**
 * Gets trending tracks by fetching a popular "Top Global" playlist.
 */
export async function getTrendingTracks(limit = 50) {
  try {
    // Deezer's "Top Global" playlist ID is 1111141961
    const response = await deezerFetch('playlist/1111142221');
    const tracks = response.tracks?.data || [];
    
    return tracks.slice(0, limit).map(normalizeTrack);
  } catch (error) {
    console.error("Error fetching Deezer top tracks:", error);
    throw error;
  }
}

/**
 * Gets a list of the top chart playlists from Deezer.
 */
export async function getTopChartPlaylists(limit = 10) {
    try {
        const response = await deezerFetch('chart/0/playlists', { limit });
        return response.data?.map(normalizePlaylist) || [];
    } catch (error) {
        console.error("Error fetching Deezer top playlists:", error);
        throw error;
    }
}

/**
 * Gets a single playlist and its tracks by its ID.
 */
export async function getPlaylistById(playlistId) {
  try {
    const playlist = await deezerFetch(`playlist/${playlistId}`);

    // Normalize the tracks inside the playlist response
    if (playlist.tracks && playlist.tracks.data) {
      playlist.tracks.data = playlist.tracks.data.map(normalizeTrack);
    }

    return playlist;
  } catch (error) {
    console.error(`Error fetching Deezer playlist ${playlistId}:`, error);
    throw error;
  }
}

/**
 * Searches for tracks on Deezer.
 */
export async function searchMusic(query) {
  // Return nothing if the search query is empty
  if (!query) return [];

  try {
    // Use the 'search' endpoint with the query parameter 'q'
    const response = await deezerFetch('search', { q: query });
    console.log("Raw Deezer Search Response:", response);

    // The search results are in the 'data' property
    return response.data?.map(normalizeTrack) || [];
  } catch (error) {
    console.error("Error searching Deezer:", error);
    throw error;
  }
}

