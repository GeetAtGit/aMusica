import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import { getTopChartPlaylists } from "../api/musicApi";
import { usePlaylistContext } from "../context/PlaylistContext";

function Library() {
  const navigate = useNavigate();
  const { favorites } = usePlayer();
  const [topPlaylists, setTopPlaylists] = useState([]);
  const { discoverPlaylistIds } = usePlaylistContext();

  const coverImage =
    favorites.length > 0
      ? favorites[favorites.length - 1].album.cover_small
      : null;

  useEffect(() => {
    getTopChartPlaylists(40)
      .then((data) => {
        const filtered = data.filter(
          (p) => p?.id && !discoverPlaylistIds.includes(String(p.id))
        );
        setTopPlaylists(filtered);
      })
      .catch((err) =>
        console.error("Failed to load top chart playlists:", err)
      );
  }, [discoverPlaylistIds]);

  const handlePlaylistClick = (id) => {
    if (id === "favorites") {
      navigate("/playlist/favorites");
    } else {
      navigate(`/playlist/${id}`);
    }
  };

  return (
    <div className="px-4 pb-10">
      <h1 className="text-2xl font-bold mb-4">Your Library</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {/* Favorite Songs Card */}
        <div
          onClick={() => handlePlaylistClick("favorites")}
          className="w-full cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-full aspect-square rounded-lg shadow-md bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Favorite Songs"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FaHeart className="text-5xl text-white opacity-70" />
            )}
          </div>
          <p className="text-white font-semibold mt-2 truncate">Favorite Songs</p>
          <p className="text-zinc-400 text-sm">
            {favorites.length} {favorites.length === 1 ? "song" : "songs"}
          </p>
        </div>

        {/* Top Chart Playlists */}
        {topPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist.id)}
            className="w-full cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-full aspect-square rounded-lg shadow-md bg-zinc-800 overflow-hidden">
              <img
                src={playlist.picture_medium}
                alt={playlist.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white font-semibold mt-2 truncate">
              {playlist.title}
            </p>
            <p className="text-zinc-400 text-sm">Playlist</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
