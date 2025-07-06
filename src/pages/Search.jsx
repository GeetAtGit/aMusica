import { useEffect, useState } from "react";
import axios from "axios";
import TrackCard from "../components/TrackCard";

const corsProxy = "http://localhost:8080/"; // your running proxy server

function Search() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreError, setGenreError] = useState(null);
  const [genreLoading, setGenreLoading] = useState(false);

  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      setGenreLoading(true);
      try {
        const res = await axios.get(`${corsProxy}https://api.deezer.com/genre`, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        setGenres(res.data.data || []);
        setGenreError(null);
      } catch (err) {
        console.error("Genre fetch error:", err);
        setGenreError("Could not fetch genres. Make sure the proxy server is running.");
      } finally {
        setGenreLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // Search tracks
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(
        `${corsProxy}https://api.deezer.com/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      setTracks(res.data.data || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Fetch top tracks by genre
  const handleGenreSelect = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);

    if (!genreId) {
      setTracks([]);
      return;
    }

    try {
      const res = await axios.get(`${corsProxy}https://api.deezer.com/genre/${genreId}/artists`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      const artistId = res.data.data?.[0]?.id;
      if (!artistId) return;

      const trackRes = await axios.get(
        `${corsProxy}https://api.deezer.com/artist/${artistId}/top?limit=25`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      setTracks(trackRes.data.data || []);
    } catch (err) {
      console.error("Genre tracks fetch error:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">🔍 Search & Browse Music</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Genre Block */}
        <div className="bg-zinc-800 p-5 rounded-xl shadow flex-1">
          <label htmlFor="genre" className="block mb-2 text-white text-lg font-semibold">
            🎧 Browse by Genre
          </label>

          {genreLoading ? (
            <p className="text-sm text-zinc-300">Loading genres...</p>
          ) : genreError ? (
            <p className="text-red-400">{genreError}</p>
          ) : (
            <select
              id="genre"
              value={selectedGenre}
              onChange={handleGenreSelect}
              className="w-full px-4 py-2 rounded-md text-white bg-zinc-700 focus:outline-none"
            >
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Search Block */}
        <div className="bg-zinc-800 p-5 rounded-xl shadow flex-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-white text-lg font-semibold">
              🔎 Search by Track or Artist
            </label>
            <input
              type="text"
              placeholder="e.g. Coldplay, Shape of You"
              className="w-full px-4 py-2 rounded-md text-white bg-zinc-700 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Results */}
      {tracks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} trackList={tracks} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 mt-10 text-center">
          No tracks found. Try a search or choose a genre.
        </p>
      )}
    </div>
  );
}

export default Search;
