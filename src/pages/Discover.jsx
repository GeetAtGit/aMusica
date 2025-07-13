import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTrendingTracks, getTopChartPlaylists } from "../api/musicApi";
import TrackCard from "../components/TrackCard";
import { usePlaylistContext } from "../context/PlaylistContext";
import { usePlayer } from "../context/PlayerContext";
import { FaPlay, FaPause } from "react-icons/fa";

function Discover() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    recentlyPlayed,
    setRecentlyPlayed,
    playTrack,
    currentTrack,
    isPlaying,
    setIsPlaying,
  } = usePlayer();

  const { setDiscoverPlaylistIds } = usePlaylistContext();
  const recentlyRef = useRef(null);

  useEffect(() => {
    Promise.all([getTrendingTracks(50), getTopChartPlaylists(10)])
      .then(([trackData, playlistData]) => {
        setTracks(trackData);
        setPlaylists(playlistData);
        setDiscoverPlaylistIds(playlistData.map((p) => String(p.id)));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Always scroll to start when a new track is added
    if (recentlyRef.current) {
      recentlyRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [recentlyPlayed]);

  if (loading) {
    return <p className="text-center text-zinc-400 mt-8">Loading content...</p>;
  }

  return (
    <div className="px-4 pb-10">
      {/* Top Chart Playlists */}
      <h1 className="text-2xl font-bold mb-4">Top Chart Playlists</h1>
      <div className="flex gap-4 overflow-x-auto mb-8 hide-scrollbar">
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
            <p className="text-white font-semibold mt-2 truncate">{playlist.title}</p>
          </div>
        ))}
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <>
          <div className="flex justify-between items-center mt-10 mb-4">
            <h1 className="text-2xl font-bold">Recently Played</h1>
            <button
              onClick={() => setRecentlyPlayed([])}
              className="text-sm text-green-400 hover:text-green-300 "
            >
              Clear All
            </button>
          </div>

          <div
            ref={recentlyRef}
            className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar scroll-snap-x min-h-[230px]"
          >
            {recentlyPlayed.map((track) => {
              const isCurrent = currentTrack?.id === track.id;

              const handleClick = () => {
                if (isCurrent && isPlaying) {
                  setIsPlaying(false);
                } else if (isCurrent && !isPlaying) {
                  setIsPlaying(true);
                } else {
                  playTrack(track, recentlyPlayed);
                }
              };

              return (
                <div
                  key={track.id}
                  onClick={handleClick}
                  className="relative min-w-[150px] w-[150px] cursor-pointer scroll-snap-item group"
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                    <img
                      src={track.album?.cover_medium || track.album?.cover_small}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Overlay Play/Pause */}
                    <div
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent && isPlaying) {
                          setIsPlaying(false);
                        } else if (isCurrent && !isPlaying) {
                          setIsPlaying(true);
                        } else {
                          playTrack(track, recentlyPlayed);
                        }
                      }}
                    >
                      <div className="bg-black/60 p-3 rounded-full text-white text-xl">
                        {isCurrent && isPlaying ? <FaPause /> : <FaPlay />}
                      </div>
                    </div>
                  </div>

                  <p className="text-white font-semibold mt-2 truncate">{track.title}</p>
                  <p className="text-zinc-400 text-sm truncate">{track.artist?.name}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Trending Tracks */}
      <h1 className="text-2xl font-bold mb-4">Trending Tracks</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} trackList={tracks} />
        ))}
      </div>
    </div>
  );
}

export default Discover;
