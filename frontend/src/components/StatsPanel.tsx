export default function StatsPanel() {
  return (
    <div className="flex justify-center gap-10 py-8 bg-slate-800/60 border-t border-slate-700">
      <div className="text-center">
        <p className="text-teal-400 text-2xl font-bold">72</p>
        <p className="text-gray-400 text-sm">Words per Minute</p>
      </div>
      <div className="text-center">
        <p className="text-teal-400 text-2xl font-bold">98%</p>
        <p className="text-gray-400 text-sm">Accuracy</p>
      </div>
      <div className="text-center">
        <p className="text-teal-400 text-2xl font-bold">45s</p>
        <p className="text-gray-400 text-sm">Time</p>
      </div>
    </div>
  )
}
