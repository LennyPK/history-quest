import { useState } from "react"

export function usePoints() {
  const [points, setPoints] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("userPoints")) || 0
    }
    return 0
  })

  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const newPoints = prev + amount
      localStorage.setItem("userPoints", newPoints.toString())
      return newPoints
    })
  }

  return { points, addPoints }
}
