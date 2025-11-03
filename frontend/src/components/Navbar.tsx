import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-lg p-4 flex justify-between items-center rounded-xl mx-4 mt-4">
      <h1 className="text-2xl font-bold text-white">TypeMaster</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-indigo-300">Home</Link>
        <Link to="/practice" className="hover:text-indigo-300">Practice</Link>
        <Link to="/results" className="hover:text-indigo-300">Results</Link>
      </div>
    </nav>
  );
}
