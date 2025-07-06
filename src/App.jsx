// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Header from "./components/Header";
import PlayerBar from "./components/PlayerBar";
import Playlist from "./pages/Playlist";


function App() {
  return (
    <BrowserRouter>
      <div className="bg-zinc-900 text-white min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow px-6 py-4">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlist/:id" element={<Playlist />} />
          </Routes>
        </main>
         <PlayerBar />
      
      </div>
    </BrowserRouter>
  );
}

export default App;
