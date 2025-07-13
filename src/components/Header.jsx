import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-800/95 px-6 py-4 flex justify-between items-center">
      
      {/* Logo + App Name */}
      <Link
        to="/"
        className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors duration-200"
      >
        {/* Logo image */}
        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        <span className="text-xl font-semibold">aMusica</span>
      </Link>
      
      <nav className="space-x-6 text-white">
        <Link
          to="/"
          className="hover:text-green-400 transition-all duration-200"
        >
          Discover
        </Link>
        <Link
          to="/search"
          className="hover:text-green-400  transition-all duration-200"
        >
          Search
        </Link>
        <Link
          to="/library"
          className="hover:text-green-400  transition-all duration-200"
        >
          Library
        </Link>
      </nav>
    </header>
  );
}

export default Header;
