import { useRef, useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaRedo,
  FaHeart,
  FaRegHeart,
  FaVolumeUp,
} from "react-icons/fa";

function MarqueeText({ children }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const textWidth = textRef.current?.scrollWidth || 0;
    setShouldMarquee(textWidth > containerWidth);
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="w-64 sm:w-48 overflow-hidden whitespace-nowrap relative"
    >
      <p
        ref={textRef}
        className={`text-white font-medium ${
          shouldMarquee ? "animate-marquee" : ""
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    isFavorite,
    toggleFavorite,
    isShuffling,
    isRepeating,
    toggleRepeat,
    toggleShuffle,
  } = usePlayer();

  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.preview) return;

    audio.src = currentTrack.preview;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay failed:", err);
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.warn("Play failed:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", playNext);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", playNext);
    };
  }, [currentTrack]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const percent = e.target.value;
    const duration = audio.duration || 0;
    audio.currentTime = (percent / 100) * duration;
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-zinc-700/60 px-4 py-3 flex items-center justify-center text-zinc-400 z-50">
        <p className="text-sm">No song selected</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-zinc-700/60 z-50">
      {/* Main Layout */}
      
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between px-4 pt-2 gap-4">
<div className="flex justify-between items-center w-full sm:w-[30%] gap-3">
  {/* Track Info */}
<div className="flex items-center gap-3 w-full sm:w-[30%]">
  <img
    src={currentTrack.album?.cover_small}
    alt="cover"
    className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
  />
  <div >
    <MarqueeText>{currentTrack.title}</MarqueeText>
    <p className=" text-sm text-zinc-400 truncate">{currentTrack.artist.name}</p>
  </div>
</div>


  {/* Volume + Favorite (mobile only) */}
  <div className="flex items-center gap-2 text-white sm:hidden">
    <button
      onClick={() => toggleFavorite(currentTrack)}
      title="Toggle Favorite"
      className="text-red-500 text-xl"
    >
      {isFavorite(currentTrack) ? <FaHeart /> : <FaRegHeart />}
    </button>
  </div>
</div>

        {/* Controls - Centered */}
        <div className="w-full sm:w-[40%] flex justify-center">
          <div className="flex items-center gap-5 text-xl text-white">
            <button onClick={toggleRepeat} title="Repeat">
              <FaRedo className={isRepeating ? "text-green-400" : ""} />
            </button>
            <button onClick={playPrevious} title="Previous">
              <FaStepBackward />
            </button>
            <button
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              className="text-2xl"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={playNext} title="Next">
              <FaStepForward />
            </button>
            <button onClick={toggleShuffle} title="Shuffle">
              <FaRandom className={isShuffling ? "text-green-400" : ""} />
            </button>
          </div>
        </div>

        {/* Volume + Favorite */}
<div className="hidden sm:flex w-full sm:w-[30%] flex-row justify-end items-center gap-4">
  {/* Volume Bar */}
  <div className="flex items-center gap-2 text-white">
    <FaVolumeUp />
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      className="w-32 sm:w-24 accent-green-500"
    />
  </div>

  {/* Favorite Button */}
  <button
    onClick={() => toggleFavorite(currentTrack)}
    title="Toggle Favorite"
    className="text-red-500 text-xl"
  >
    {isFavorite(currentTrack) ? <FaHeart /> : <FaRegHeart />}
  </button>
</div>
      </div>

      {/* Progress Bar at bottom always */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-4 text-sm text-zinc-300 px-4 pb-2">
        <span className="w-10 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full max-w-[80%] sm:max-w-[50%] accent-green-500"
        />
        <span className="w-10 text-left">{formatTime(duration)}</span>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        key={currentTrack?.id}
        src={currentTrack.preview}
        preload="auto"
      />
    </div>
  );
}

export default PlayerBar;
