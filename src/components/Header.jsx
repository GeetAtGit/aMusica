import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-800/95 px-6 py-4 flex justify-between items-center ">
      <h1 className="text-xl font-semibold"> aMusica</h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Discover</Link>
        <Link to="/search" className="hover:underline">Search</Link>
        <Link to="/library" className="hover:underline">Library</Link>
      </nav>
    </header>
  );
}
export default Header;
