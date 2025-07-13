import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [discoverPlaylistIds, setDiscoverPlaylistIds] = useState([]);
  return (
    <PlaylistContext.Provider value={{ discoverPlaylistIds, setDiscoverPlaylistIds }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylistContext() {
  return useContext(PlaylistContext);
}
