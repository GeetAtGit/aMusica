import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { getTrendingTracks } from "../api/musicApi"; // We need this to get the song list
import TrackCard from "../components/TrackCard";

function Search() {
  const [query, setQuery] = useState("");
  const [allTracks, setAllTracks] = useState([]); // To store all trending tracks
  const [filteredResults, setFilteredResults] = useState([]); // To store the filtered results
  const [loading, setLoading] = useState(true);

  // 1. Fetch all trending tracks when the page loads
  useEffect(() => {
    getTrendingTracks(100) // Get a large list to search from
      .then((data) => {
        setAllTracks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tracks for search:", err);
        setLoading(false);
      });
  }, []); // The empty array [] means this runs only once

  // 2. Filter the tracks whenever the user types in the search bar
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredResults([]); // If search bar is empty, show no results
      return;
    }

    const results = allTracks.filter(track =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist?.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(results);

  }, [query, allTracks]); // Re-run the filter when the query or the track list changes

  return (
    <div className="px-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-zinc-800 p-2 rounded-lg mb-8 mt-10">
        <FaSearch className="text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search within trending songs..."
          className="bg-transparent text-white placeholder-zinc-400 w-full focus:outline-none"
        />
      </div>

      {/* Results */}
      <div>
        {loading && <p className="text-center text-zinc-400">Loading song list...</p>}
        
        {!loading && query && filteredResults.length === 0 && (
          <p className="text-center text-zinc-400">No results found for "{query}".</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredResults.map((track) => (
            <TrackCard key={track.id} track={track} trackList={filteredResults} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;