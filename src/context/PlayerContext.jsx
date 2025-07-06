import { createContext, useContext, useState, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  const currentTrack = queue[currentIndex];

  const playTrack = (track, trackList = []) => {
    const index = trackList.findIndex((t) => t.id === track.id);
    setQueue(trackList);
    setCurrentIndex(index >= 0 ? index : 0);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const playNext = () => {
    if (isShuffling) {
      setCurrentIndex(Math.floor(Math.random() * queue.length));
    } else if (isRepeating) {
      setCurrentIndex((prev) => prev); // stay on current
    } else {
      setCurrentIndex((prev) => (prev + 1) % queue.length);
    }
    setIsPlaying(true);
  };

  const playPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  };

  const toggleShuffle = () => setIsShuffling((prev) => !prev);
  const toggleRepeat = () => setIsRepeating((prev) => !prev);

  const toggleFavorite = (track) => {
    const exists = favorites.find((fav) => fav.id === track.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== track.id)
      : [...favorites, track];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = (track) =>
    favorites.some((fav) => fav.id === track?.id);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentTrack,
        currentIndex,
        isPlaying,
        isShuffling,
        isRepeating,
        favorites,
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// ✅ This line is important
export const usePlayer = () => useContext(PlayerContext);
