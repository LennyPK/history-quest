"use client"

import { Card, CardContent } from "@/components/ui/card"
import { usePoints } from "@/hooks/usePoints"
import rawQuestions from "@/lib/data/ww2_quiz.json"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"

interface Question {
  id: number
  question: string
  options: string[]
  answer: string
  explanation: string
  shuffledOptions?: string[] // 🔄 New: randomized option order
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5)
}

export default function Quiz() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const { addPoints } = usePoints()

  useEffect(() => {
    const randomized = shuffleArray(rawQuestions)
      .slice(0, 10)
      .map((q) => ({
        ...q,
        shuffledOptions: shuffleArray(q.options), // 🔄 Shuffle options per question
      }))
    setShuffledQuestions(randomized)
  }, [])

  const currentQuestion = shuffledQuestions[currentIndex]
  const score = Object.entries(userAnswers).reduce((acc, [qid, ans]) => {
    const correct = shuffledQuestions.find((q) => q.id === Number(qid))?.answer
    return correct === ans ? acc + 1 : acc
  }, 0)

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }))
    // Award points if answer is correct
    if (selectedOption === currentQuestion.answer) {
      addPoints(100) // Award 100 points for correct answer
    }
    setShowFeedback(true)
  }

  const handleNext = () => {
    setSelectedOption(null)
    setShowFeedback(false)
    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setQuizFinished(true)
    }
  }

  const resetQuiz = () => {
    const randomized = shuffleArray(rawQuestions)
      .slice(0, 10)
      .map((q) => ({
        ...q,
        shuffledOptions: shuffleArray(q.options),
      }))
    setShuffledQuestions(randomized)
    setCurrentIndex(0)
    setSelectedOption(null)
    setUserAnswers({})
    setShowFeedback(false)
    setQuizFinished(false)
  }

  if (shuffledQuestions.length === 0) return <p>Loading quiz...</p>

  if (quizFinished) {
    return (
      <div className="space-y-6">
        <h2 className="text-center text-2xl font-bold">Quiz Complete!</h2>
        <p className="text-center text-lg">
          Your Score: {score} / {shuffledQuestions.length}
        </p>
        <div className="space-y-4">
          {shuffledQuestions.map((q, index) => {
            const userAnswer = userAnswers[q.id]
            const isCorrect = userAnswer === q.answer
            return (
              <Card key={q.id}>
                <CardContent className="space-y-2 pt-4">
                  <div className="font-semibold">
                    Q{index + 1}: {q.question}
                  </div>
                  <div
                    className={`flex items-center gap-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}
                  >
                    <span>Your Answer: {userAnswer}</span>
                    {isCorrect ? (
                      <Check className="h-6 w-6 text-green-600" />
                    ) : (
                      <X className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  {/* {!isCorrect && <div className="text-green-700">Correct Answer: {q.answer}</div>} */}
                  <div className="text-muted-foreground text-sm">{q.explanation}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="text-center">
          <button
            onClick={resetQuiz}
            className="mt-4 rounded bg-black px-5 py-2 text-white hover:bg-gray-800"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>
                Question {currentIndex + 1} of {shuffledQuestions.length}
              </span>
              <span>
                Score: {score}/{shuffledQuestions.length}
              </span>
            </div>

            <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>

            <div className="space-y-3">
              {currentQuestion.shuffledOptions?.map((opt) => {
                const isSelected = selectedOption === opt
                const isCorrect = opt === currentQuestion.answer

                let feedbackClass = ""
                if (showFeedback) {
                  if (isSelected && isCorrect) feedbackClass = "bg-green-100 border-green-600"
                  else if (isSelected && !isCorrect) feedbackClass = "bg-red-100 border-red-600"
                  else feedbackClass = "opacity-50"
                } else {
                  feedbackClass = isSelected ? "bg-amber-100 border-amber-500" : "border-gray-300"
                }

                const icon =
                  showFeedback && isSelected ? (
                    isCorrect ? (
                      <Check className="h-6 w-6 text-green-600" />
                    ) : (
                      <X className="h-6 w-6 text-red-600" />
                    )
                  ) : null

                return (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => !showFeedback && setSelectedOption(opt)}
                    className={`flex w-full items-center justify-between rounded border px-4 py-2 text-left transition ${feedbackClass}`}
                  >
                    <span>{opt}</span>
                    {icon && <span>{icon}</span>}
                  </motion.button>
                )
              })}
            </div>

            {showFeedback && (
              <p className="text-muted-foreground mt-4 text-sm">{currentQuestion.explanation}</p>
            )}

            <div className="mt-6 flex justify-end">
              {!showFeedback ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  className="rounded bg-black px-5 py-2 text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  Submit Answer
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="text-primary rounded bg-amber-500 px-5 py-2 font-bold hover:bg-amber-700 hover:text-white"
                >
                  Next →
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
