// src/components/TypingArea.tsx
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const commonWords = [
  "the","be","to","of","and","a","in","that","have","I",
  "it","for","not","on","with","he","as","you","do","at",
  "this","but","his","by","from","they","we","say","her","she",
  "or","an","will","my","one","all","would","there","their","what",
  "so","up","out","if","about","who","get","which","go","me",
  "when","make","can","like","time","no","just","him","know","take",
  "people","into","year","your","good","some","could","them","see","other",
  "than","then","now","look","only","come","its","over","think","also",
  "back","after","use","two","how","our","work","first","well","way",
  "even","new","want","because","any","these","give","day","most","us"
]

function generateRandomText(wordCount = 50) {
  const result: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)]
    result.push(randomWord)
  }
  return result
}

type TypedWord = { typed: string; correct: boolean }

export default function TypingArea() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [targetWords, setTargetWords] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<"short" | "medium" | "long">("medium")
  const wordCounts = { short: 20, medium: 50, long: 100 }

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [input, setInput] = useState("")
  const [typedWords, setTypedWords] = useState<TypedWord[]>([])

  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    resetTest(difficulty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty])

  useEffect(() => {
    let timer: number | undefined
    if (isRunning && startTime) {
      timer = window.setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000)
      }, 100)
    }
    return () => {
      if (timer) window.clearInterval(timer)
    }
  }, [isRunning, startTime])

  // Start timer when user types first char
  const ensureStarted = () => {
    if (!isRunning) {
      setIsRunning(true)
      if (!startTime) setStartTime(Date.now())
    }
  }

  const handleFocus = () => {
    // when user focuses back, resume if previously started
    if (!isRunning && startTime) setIsRunning(true)
  }

  const handleBlur = () => {
    setIsRunning(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // start on first typing
    if (!isRunning && value.length > 0) ensureStarted()

    // if space pressed at end, record typed word and move on
    if (value.endsWith(" ")) {
      const typed = value.trim()
      const target = targetWords[currentWordIndex] ?? ""
      const correct = typed === target
      setTypedWords((prev) => [...prev, { typed, correct }])
      const nextIndex = currentWordIndex + 1
      setCurrentWordIndex(nextIndex)
      setInput("")
      // finish if we've reached the end
      if (nextIndex >= targetWords.length) {
        setIsRunning(false)
        // small delay to ensure elapsedTime updated
        setTimeout(finishAndNavigate, 50)
      }
    } else {
      setInput(value)
    }
  }

  // allow pressing Enter to finish as well
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // treat like finishing current word (record it)
      const typed = input.trim()
      const target = targetWords[currentWordIndex] ?? ""
      const correct = typed === target
      setTypedWords((prev) => [...prev, { typed, correct }])
      const nextIndex = currentWordIndex + 1
      setCurrentWordIndex(nextIndex)
      setInput("")
      if (nextIndex >= targetWords.length) {
        setIsRunning(false)
        setTimeout(finishAndNavigate, 50)
      }
    }
  }

  const finishAndNavigate = () => {
    const stats = computeStats()
    navigate("/results", {
      state: {
        accuracy: stats.accuracy,
        wpm: stats.wpm,
        time: stats.time,
        difficulty,
      },
    })
  }

  const computeStats = () => {
    const typedCount = typedWords.length + (input.trim().length > 0 ? 1 : 0) // include current typed word if not empty
    const correctCount = typedWords.filter((t) => t.correct).length + (input.trim() === targetWords[currentWordIndex] ? 1 : 0)
    const accuracy = typedCount > 0 ? Math.round((correctCount / typedCount) * 100) : 100
    const timeSeconds = elapsedTime || 0.001 // avoid divide by zero
    const wpm = Math.round((typedCount / timeSeconds) * 60)
    return { accuracy, wpm, time: timeSeconds.toFixed(1) }
  }

  const resetTest = (newDifficulty?: typeof difficulty) => {
    const d = newDifficulty || difficulty
    const words = generateRandomText(wordCounts[d])
    setTargetWords(words)
    setDifficulty(d)
    setCurrentWordIndex(0)
    setInput("")
    setTypedWords([])
    setStartTime(null)
    setElapsedTime(0)
    setIsRunning(false)
    // focus input for convenience
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // helpers for rendering each word
  const renderWord = (word: string, index: number) => {
    // already typed words: show green or red depending on correctness
    if (index < typedWords.length) {
      return (
        <span
          className={`mx-1 whitespace-nowrap ${typedWords[index].correct ? "text-green-400" : "text-rose-500"}`}
        >
          {word}
        </span>
      )
    }

    // current word (being typed): show per-char coloring
    if (index === currentWordIndex) {
      const chars = word.split("")
      return (
        <span className="mx-1 whitespace-nowrap underline text-yellow-300">
          {chars.map((ch, ci) => {
            const userChar = input[ci] ?? ""
            const charClass = userChar
              ? userChar === ch
                ? "text-teal-400"
                : "text-rose-500"
              : "text-gray-300"
            return (
              <span key={ci} className={`${charClass}`}>
                {ch}
              </span>
            )
          })}
        </span>
      )
    }

    // future words
    return <span key={index} className="mx-1 whitespace-nowrap text-gray-300">{word}</span>
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center w-full">
      <div className="flex gap-4 mb-6">
        {(["short", "medium", "long"] as const).map((level) => (
          <button
            key={level}
            onClick={() => resetTest(level)}
            className={`px-4 py-2 rounded-lg capitalize transition font-semibold ${
              difficulty === level
                ? "bg-teal-500 text-white"
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <p className="text-gray-400 mb-4 text-lg">
        Difficulty: <span className="text-teal-400 capitalize">{difficulty}</span>
      </p>

      {/* Words container: flex-wrap so words don't overflow */}
      <div className="bg-slate-700 text-lg p-6 rounded-xl shadow-xl w-[90%] max-w-4xl text-left leading-relaxed select-none">
        <div className="flex flex-wrap items-center">
          {targetWords.map((w, i) => (
            <span key={i} className="inline-block">
              {renderWord(w, i)}
            </span>
          ))}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="mt-8 w-[90%] max-w-4xl p-3 text-lg rounded-md outline-none bg-slate-800 border border-slate-700 focus:border-teal-400 transition"
        placeholder="Start typing..."
        autoComplete="off"
        spellCheck={false}
      />

      <div className="flex gap-8 mt-8 text-gray-300 text-lg">
        <p>⏱️ <span className="text-teal-400">{elapsedTime.toFixed(1)}s</span></p>
        <p>⚡ WPM: <span className="text-teal-400">{computeStats().wpm}</span></p>
        <p>🎯 Accuracy: <span className="text-teal-400">{computeStats().accuracy}%</span></p>
      </div>
    </div>
  )
}
