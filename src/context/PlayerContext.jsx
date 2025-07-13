import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem("recentlyPlayed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentTrack = queue[currentIndex];

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  const addToRecentlyPlayed = (track) => {
    if (!track?.id) return;
    setRecentlyPlayed((prev) => {
      const withoutDupes = prev.filter((t) => t.id !== track.id);
      return [track, ...withoutDupes].slice(0, 20);
    });
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const playTrack = (track, trackList = []) => {
    if (!track?.id) return;

    const list = isShuffling ? shuffleArray(trackList) : trackList;
    const index = list.findIndex((t) => t.id === track.id);

    setQueue(list);
    setCurrentIndex(index >= 0 ? index : 0);
    setIsPlaying(true);
    addToRecentlyPlayed(track);
  };

  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    const nextIndex = isShuffling
      ? Math.floor(Math.random() * queue.length)
      : (currentIndex + 1) % queue.length;

    setCurrentIndex(nextIndex);
    setIsPlaying(true);
    addToRecentlyPlayed(queue[nextIndex]);
  }, [queue, currentIndex, isShuffling]);

  const playPrevious = () => {
    if (queue.length === 0) return;

    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
    addToRecentlyPlayed(queue[prevIndex]);
  };

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const toggleShuffle = () => setIsShuffling((prev) => !prev);
  const toggleRepeat = () => setIsRepeating((prev) => !prev);

  const toggleFavorite = (track) => {
    if (!track?.id) return;
    const exists = favorites.find((t) => t.id === track.id);
    const updated = exists
      ? favorites.filter((t) => t.id !== track.id)
      : [...favorites, track];
    setFavorites(updated);
  };

  const isFavorite = (track) =>
    favorites.some((fav) => fav.id === track?.id);

  // ✅ Handle repeat and next inside audio 'ended' event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeating, playNext]);

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        queue,
        currentTrack,
        currentIndex,
        isPlaying,
        isShuffling,
        isRepeating,
        favorites,
        recentlyPlayed,
        setRecentlyPlayed,
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        isFavorite,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
