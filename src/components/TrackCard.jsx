import { FaPlay, FaPause } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";

function TrackCard({ track, trackList }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const isCurrent = currentTrack?.id === track.id;

  const handleOverlayClick = (e) => {
    e.stopPropagation(); // prevent parent click events
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, trackList);
    }
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow hover:shadow-xl transition cursor-pointer w-full">
      <div className="relative group w-full aspect-square overflow-hidden rounded-lg">
        <img
          src={track.album?.cover_medium}
          alt={track.title}
          className="object-cover w-full h-full"
        />

        {/* Overlay Play/Pause */}
        <div
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <div className="bg-black/60 p-3 rounded-full text-white text-2xl">
            {isCurrent && isPlaying ? <FaPause /> : <FaPlay />}
          </div>
        </div>

        {/* Now Playing Animation */}
    {isCurrent && isPlaying && (
      <div className="absolute bottom-2 right-2 flex items-end gap-[2px] h-5">
        <span className="equalizer-bar bar1 h-full"></span>
        <span className="equalizer-bar bar2 h-[80%]"></span>
        <span className="equalizer-bar bar3 h-[60%]"></span>
      </div>
    )}
      </div>


    {/* Track Info */}  
      <h3 className="mt-2 text-white font-semibold truncate">{track.title}</h3>
      <p className="text-sm text-zinc-400 truncate">{track.artist?.name}</p>
    </div>

    
  );
  
}

export default TrackCard;
