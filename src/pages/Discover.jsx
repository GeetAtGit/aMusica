import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrendingTracks, getTopChartPlaylists } from "../api/musicApi";
import TrackCard from "../components/TrackCard";

function Discover() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]); // ✅ Declare this
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch both trending tracks and top playlists
    Promise.all([getTrendingTracks(50), getTopChartPlaylists()])
      .then(([trackData, playlistData]) => {
        setTracks(trackData);
        setPlaylists(playlistData); // ✅ Set playlists here
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-zinc-400 mt-8">Loading content...</p>;
  }

  return (
    <div className="px-4">
      {/* Top Chart Playlists */}
      <h1 className="text-2xl font-bold mb-4">🎵 Top Chart Playlists</h1>
      <div className="flex gap-4 overflow-x-auto mb-8">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className="min-w-[150px] cursor-pointer hover:opacity-80"
          >
            <img
              src={playlist.picture_medium}
              alt={playlist.title}
              className="rounded-lg shadow w-full aspect-square object-cover"
            />
            <p className="text-white font-semibold mt-2 truncate">
              {playlist.title}
            </p>
          </div>
        ))}
      </div>

      {/* Trending Tracks */}
      <h1 className="text-2xl font-bold mb-4">🔥 Trending Tracks</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} trackList={tracks} />
        ))}
      </div>
    </div>
  );
}

export default Discover;
