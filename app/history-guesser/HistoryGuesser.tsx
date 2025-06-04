"use client"
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps"
import { LightbulbIcon, TargetIcon, Trash2 } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import questionsData from "../../lib/data/history-guesser.json"

interface Question {
  id: number
  question: string
  answer: { lat: number; lng: number }
  hint: string
  tolerance: number
  mapCenter: { lat: number; lng: number }
  mapZoom: number
}

interface LatLng {
  lat: number
  lng: number
}

const CustomMap = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userGuess, setUserGuess] = useState<{ lat: number; lng: number } | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<{ lat: number; lng: number } | null>(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState("playing")
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isDropMarkerMode, setIsDropMarkerMode] = useState(true)

  useEffect(() => {
    try {
      setQuestions(questionsData)
      setLoading(false)
    } catch (err) {
      console.error("Error loading questions:", err)
      setError("Failed to load questions")
      setLoading(false)
    }
  }, [])

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  interface MapClickEvent {
    detail: {
      latLng: LatLng | null
    }
  }

  const handleMapClick = useCallback(
    (event: MapClickEvent) => {
      if (gameState !== "playing") return
      const latLng = event.detail.latLng
      if (!latLng) return
      setUserGuess({ lat: latLng.lat, lng: latLng.lng })
    },
    [gameState]
  )

  const makeGuess = () => {
    if (!userGuess || gameState !== "playing" || !currentQuestion) return
    setCorrectAnswer(currentQuestion.answer)
    const distance = calculateDistance(
      userGuess.lat,
      userGuess.lng,
      currentQuestion.answer.lat,
      currentQuestion.answer.lng
    )
    const isCorrect: boolean = distance <= 50
    if (isCorrect) {
      setScore(score + 1)
      setFeedback("🎉 Amazing! You nailed it!")
    } else {
      setFeedback(`💭 Close one! You were ${Math.round(distance)}km away from the target.`)
    }
    setGameState("answered")
  }

  const clearMarker = () => {
    setUserGuess(null)
    setIsDropMarkerMode(false)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserGuess(null)
      setCorrectAnswer(null)
      setGameState("playing")
      setShowHint(false)
      setFeedback("")
      setIsDropMarkerMode(true)
    } else {
      setGameState("finished")
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserGuess(null)
    setCorrectAnswer(null)
    setScore(0)
    setGameState("playing")
    setShowHint(false)
    setFeedback("")
    setIsDropMarkerMode(true)
  }

  interface ToleranceCircleProps {
    center: LatLng
    radius: number
  }

  const ToleranceCircle: React.FC<ToleranceCircleProps> = ({ center, radius }) => {
    const map = useMap()

    useEffect(() => {
      if (!map) return
      const circle = new google.maps.Circle({
        strokeColor: "#10b981",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#34d399",
        fillOpacity: 0.25,
        map,
        center,
        radius: radius * 1000,
      })
      return () => circle.setMap(null)
    }, [map, center, radius])
    return null
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg border bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-4 text-6xl">😵</div>
            <h2 className="mb-4 text-2xl font-bold">Oops! Something went wrong</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-6xl">🌍</div>
          <p className="text-xl text-gray-700">No questions available for this adventure.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 rounded-lg border bg-black p-6 shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">{currentQuestion.question}</h2>
          <div className="text-right">
            <div className="mb-1 rounded-full bg-gray-800 px-4 py-2">
              <span className="font-bold text-white">
                {score}/{questions.length}
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Question {currentQuestionIndex + 1}/{questions.length}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-6 h-[60vh] overflow-hidden rounded-lg border shadow">
        <APIProvider apiKey={process.env.GOOGLE_API_KEY || ""}>
          <Map
            style={{ height: "100%", width: "100%" }}
            defaultZoom={currentQuestion.mapZoom}
            defaultCenter={currentQuestion.mapCenter}
            gestureHandling={"greedy"}
            disableDefaultUI
            onClick={handleMapClick}
            mapId="77c887a07c2c59f8651bae4f"
          >
            {userGuess && <Marker position={userGuess} title="Your guess" />}
            {correctAnswer && gameState === "answered" && (
              <>
                <Marker position={correctAnswer} title="Correct location" />
                <ToleranceCircle center={correctAnswer} radius={50} />
              </>
            )}
          </Map>
        </APIProvider>

        {/* Hint overlay*/}
        {showHint && gameState === "playing" && (
          <div className="absolute left-0 right-0 top-4 z-10 px-6">
            <div className="mx-auto max-w-2xl rounded-lg border border-white/20 bg-black/30 p-4 shadow-lg backdrop-blur-md">
              <p className="flex items-center justify-center text-center font-medium text-white">
                <span className="mr-2 text-2xl">💡</span>
                {currentQuestion.hint}
              </p>
            </div>
          </div>
        )}

        {/* Game finished overlay */}
        {gameState === "finished" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="mx-4 max-w-md rounded-lg bg-white p-8 shadow-2xl">
              <div className="mb-4 text-center text-6xl">
                {score === questions.length ? "🏆" : score >= questions.length * 0.7 ? "🎉" : "📚"}
              </div>
              <h2 className="mb-4 text-center text-3xl font-bold">Quest Complete!</h2>
              <div
                className={`mb-6 rounded-lg p-4 text-center text-white ${
                  score === questions.length
                    ? "bg-green-500"
                    : score >= questions.length * 0.7
                      ? "bg-blue-500"
                      : "bg-orange-500"
                }`}
              >
                <p className="text-2xl font-bold">
                  {score}/{questions.length}
                </p>
                <p className="text-sm">Final Score</p>
              </div>
              <div className="mb-6 text-center text-gray-600">
                {score === questions.length && (
                  <p className="font-semibold">Perfect! You&apos;re a geography legend! 🌟</p>
                )}
                {score >= questions.length * 0.7 && score < questions.length && (
                  <p className="font-semibold">Excellent work! You know your locations! ⭐</p>
                )}
                {score < questions.length * 0.7 && (
                  <p className="font-semibold">
                    Keep exploring! Every journey teaches us something! 🗺️
                  </p>
                )}
              </div>
              <button
                onClick={resetQuiz}
                className="mx-auto block rounded bg-black px-8 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                🔄 New Adventure
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {gameState === "playing" && (
        <div className="mb-6 rounded-lg border bg-white p-6 shadow">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 rounded-lg border bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
            >
              <LightbulbIcon className="h-5 w-5" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>

            <button
              onClick={clearMarker}
              className="flex items-center gap-2 rounded-lg border bg-gray-50 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <Trash2 className="h-5 w-5" />
              Clear
            </button>

            <button
              onClick={makeGuess}
              className={`flex items-center gap-2 rounded-lg px-8 py-3 font-medium transition ${
                userGuess
                  ? "bg-black text-white hover:bg-gray-800"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
              disabled={!userGuess}
            >
              <TargetIcon className="h-5 w-5" />
              Make Guess
            </button>
          </div>
        </div>
      )}

      {/* Feedback after answering */}
      {gameState === "answered" && (
        <div className="mb-6 rounded-lg border bg-white p-6 shadow">
          <div className="flex items-center justify-between gap-4">
            <div
              className={`flex-1 rounded-lg border p-4 ${
                feedback.includes("Amazing")
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-orange-200 bg-orange-50 text-orange-800"
              }`}
            >
              <p className="font-bold">{feedback}</p>
            </div>
            <button
              onClick={nextQuestion}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Challenge
                  <span className="flex items-center justify-center">➡️</span>
                </>
              ) : (
                <>
                  Finish Quest
                  <span className="flex items-center justify-center">🏁</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomMap
