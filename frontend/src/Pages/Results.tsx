import { useLocation, Link } from "react-router-dom"

export default function Results() {
  const location = useLocation()
  const { accuracy, wpm, time, difficulty } = location.state || {}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">Your Results</h1>

      <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-[90%] max-w-md text-center">
        <p className="text-xl mb-4">⚡ WPM: <span className="text-teal-400">{wpm}</span></p>
        <p className="text-xl mb-4">🎯 Accuracy: <span className="text-teal-400">{accuracy}%</span></p>
        <p className="text-xl mb-4">⏱️ Time: <span className="text-teal-400">{time}s</span></p>
        <p className="text-xl mb-4">📈 Difficulty: <span className="text-teal-400 capitalize">{difficulty}</span></p>

        <div className="mt-6 flex gap-4 justify-center">
          <Link
            to="/practice"
            className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-lg font-semibold transition"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-semibold transition"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
