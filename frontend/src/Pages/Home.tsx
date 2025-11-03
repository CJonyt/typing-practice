import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20">
      <h2 className="text-4xl font-bold mb-4">Welcome to TypeMaster</h2>
      <p className="text-lg mb-8 opacity-90">Sharpen your typing speed and accuracy</p>
      <Link
        to="/practice"
        className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-200 transition"
      >
        Start Typing
      </Link>
    </div>
  );
}
