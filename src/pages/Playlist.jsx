import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../api/musicApi";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";

function Playlist() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleFavorite,
    favorites,
  } = usePlayer();

  // ✅ THIS IS THE UPDATED SECTION
  useEffect(() => {
    setLoading(true);

    if (id === 'favorites') {
      // If the ID is 'favorites', create a playlist object from your local favorites
      const favoritesPlaylist = {
        title: "Favorite Songs",
        description: `You have ${favorites.length} favorite ${favorites.length === 1 ? 'song' : 'songs'}.`,
        // Use the image of the first favorite song as a cover
        picture_xl: favorites[0]?.album?.cover_small,
        picture_big: favorites[0]?.album?.cover_small,
        tracks: {
          data: favorites, // The tracks are simply our favorites array
        },
      };
      setPlaylist(favoritesPlaylist);
      setLoading(false);
    } else {
      // Otherwise, fetch the playlist from the API as it did before
      getPlaylistById(id)
        .then((data) => {
          setPlaylist(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching playlist:", err);
          setLoading(false);
        });
    }
    // ✅ The dependency array is updated to re-render if the favorites list changes
  }, [id, favorites]);

  const isFavorite = (trackId) => favorites?.some((t) => t.id === trackId);
  const isCurrent = (trackId) => currentTrack?.id === trackId;

  const handlePlayPause = (track, trackList) => {
    if (isCurrent(track.id)) {
      togglePlay();
    } else {
      playTrack(track, trackList);
    }
  };

  if (loading)
    return <p className="text-zinc-400 text-center mt-10">Loading playlist...</p>;
  if (!playlist)
    return <p className="text-red-400 text-center mt-10">Playlist not found.</p>;

  const tracks = playlist.tracks?.data || [];

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10">
        <img
          src={playlist.picture_xl || playlist.picture_big}
          alt={playlist.title}
          className="w-48 h-48 object-cover rounded-lg shadow-xl bg-zinc-800"
        />
        <div className="text-center md:text-left">
          <p className="uppercase text-sm text-zinc-400 font-semibold">Playlist</p>
          <h1 className="text-4xl font-bold text-white">{playlist.title}</h1>
          <p className="text-zinc-400 mt-2">
            {playlist.description || "Enjoy curated tracks from top charts!"}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            {tracks.length} songs • {playlist.duration ? Math.floor(playlist.duration / 60) : 0} mins
          </p>
        </div>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-[24px_36px_1fr_1fr_32px_32px] sm:grid-cols-[32px_40px_1fr_1fr_40px_40px]
 gap-4 text-sm font-semibold text-zinc-400 border-b border-zinc-700 pb-2 mb-4">
        <span>#</span>
        <span></span>
        <span>Title</span>
        <span className="hidden sm:block">Artist</span>
        <span></span>
        <span></span>
      </div>

      {/* Tracks */}
      {tracks.map((track, index) => {
        const playing = isCurrent(track.id) && isPlaying;
        const fav = isFavorite(track.id);

        return (
          <div
            key={track.id}
            className="flex sm:grid sm:grid-cols-[32px_40px_1fr_1fr_40px_40px] gap-4 items-center py-2 hover:bg-zinc-800 rounded-md group"
          >
            {/* Index / Equalizer */}
            <div className="w-4 text-center shrink-0">
              {playing ? (
                <div className="flex items-end gap-[2px] h-5">
                  <span className="equalizer-bar bar1 h-full bg-green-400 w-[2px] animate-pulse"></span>
                  <span className="equalizer-bar bar2 h-[80%] bg-green-400 w-[2px] animate-pulse"></span>
                  <span className="equalizer-bar bar3 h-[60%] bg-green-400 w-[2px] animate-pulse"></span>
                </div>
              ) : (
                <span className="text-zinc-400">{index + 1}</span>
              )}
            </div>

            {/* Album cover */}
            <img
              src={track.album?.cover_small}
              alt={track.title}
              onClick={() => handlePlayPause(track, tracks)}
              className="w-10 h-10 rounded cursor-pointer hover:scale-105 transition shrink-0"
            />

            {/* Title + Artist stacked on mobile */}
            <div className="flex flex-col sm:hidden overflow-hidden grow">
              <span className="text-white font-medium truncate">{track.title}</span>
              <span className="text-zinc-400 text-sm truncate">{track.artist?.name}</span>
            </div>

            {/* Title and Artist separate on desktop */}
            <div className="hidden sm:block text-white font-medium truncate">{track.title}</div>
            <div className="hidden sm:block text-zinc-400 truncate">{track.artist?.name}</div>

            {/* Spacer on mobile to push buttons right */}
            <div className="flex-grow sm:hidden" />

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => handlePlayPause(track, tracks)}
              className="text-white hover:text-green-400 text-sm sm:text-base shrink-0"
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => toggleFavorite(track)}
              className="text-white hover:text-red-400 text-sm sm:text-base shrink-0"
            >
              {fav ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Playlist;