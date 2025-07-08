import { useEffect, useState } from "react";
import axios from "axios";
import TrackCard from "../components/TrackCard";

const corsProxy = "/.netlify/functions/deezer?url=";

function Search() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [message, setMessage] = useState("");

  // Load genres once
  useEffect(() => {
    axios
      .get(`${corsProxy}${encodeURIComponent("https://api.deezer.com/genre")}`)
      .then(res => {
        setGenres(res.data.data || []);
      })
      .catch(err => {
        console.error("Failed to load genres:", err);
        setMessage("❌ Could not load genres.");
      });
  }, []);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return setMessage("Please enter a search term.");

    setMessage("Searching…");
    try {
      const res = await axios.get(
        `${corsProxy}${encodeURIComponent(`https://api.deezer.com/search?q=${query}`)}`
      );
      const list = res.data.data || [];
      setTracks(list);
      setMessage(list.length ? "" : "No tracks found for your search.");
    } catch (err) {
      console.error("Search error:", err);
      setMessage("❌ Error while searching.");
    }
  };

  // Genre handler
  const handleGenreSelect = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    setTracks([]);
    setMessage("");

    if (!genreId) return;

    setMessage("Loading tracks…");
    try {
      const artistRes = await axios.get(
        `${corsProxy}${encodeURIComponent(`https://api.deezer.com/genre/${genreId}/artists`)}`
      );
      const artistId = artistRes.data.data?.[0]?.id;
      if (!artistId) return setMessage("No artist found for this genre.");

      const trackRes = await axios.get(
        `${corsProxy}${encodeURIComponent(`https://api.deezer.com/artist/${artistId}/top?limit=25`)}`
      );
      const list = trackRes.data.data || [];
      setTracks(list);
      setMessage(list.length ? "" : "No top tracks found.");
    } catch (err) {
      console.error("Genre selection error:", err);
      setMessage("❌ Error loading genre tracks.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">🔍 Search & Browse Music</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Genre */}
        <div className="bg-zinc-800 p-5 rounded-xl shadow flex-1">
          <label htmlFor="genre" className="block mb-2 text-white text-lg font-semibold">
            🎧 Browse by Genre
          </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={handleGenreSelect}
            className="w-full px-4 py-2 rounded-md text-white bg-zinc-700 focus:outline-none"
          >
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="bg-zinc-800 p-5 rounded-xl shadow flex-1">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-white text-lg font-semibold">
              🔎 Search by Track or Artist
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Coldplay, Shape of You"
                className="flex-1 px-4 py-2 rounded-md text-white bg-zinc-700 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {/* 👇 Add this button so form actually submits */}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-500"
              >
                Search
              </button>
              {/* Optional: clear */}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTracks([]);
                  setMessage("");
                }}
                className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-500"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feedback or error */}
      {message && <p className="text-red-400 text-center mb-6">{message}</p>}

      {/* Results grid */}
      {tracks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} trackList={tracks} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
