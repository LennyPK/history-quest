"use client";
import { useEffect, useState } from "react";
import LeaderboardPodium from "./LeaderBoardPodium";

type LeaderboardUser = {
  name: string
  points: number
  rank: number
  profileImage: string
  isCurrentUser?: boolean
}

const initialTopUsers: LeaderboardUser[] = [
  {
    name: "Ben Dover",
    points: 1250,
    rank: 2,
    profileImage: "/pfp.svg",
  },
  {
    name: "John Doe",
    points: 1250,
    rank: 1,
    profileImage: "/pfp.svg",
  },
  {
    name: "Buck Nekkid",
    points: 1250,
    rank: 3,
    profileImage: "/pfp.svg",
  },
]

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "bg-yellow-400"
    case 2:
      return "bg-gray-300"
    case 3:
      return "bg-amber-600"
    default:
      return "bg-gray-200"
  }
}

function getRankTextColor(rank: number): string {
  return rank > 3 ? "text-black" : "text-white"
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [currentUserPoints, setCurrentUserPoints] = useState<number>(() => {
    // Try to get stored points from localStorage, default to 0
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('userPoints')) || 0
    }
    return 0
  })

  // Update users array with rankings whenever points change
  useEffect(() => {
    // Add current user to the list and sort by points
    const currentUser: LeaderboardUser = {
      name: "You",
      points: currentUserPoints,
      rank: 0, // Will be calculated
      profileImage: "/pfp.svg",
      isCurrentUser: true
    }

    const allUsers = [...initialTopUsers, currentUser]
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))

    setUsers(allUsers)

    // Store current user points in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPoints', currentUserPoints.toString())
    }
  }, [currentUserPoints])

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <h1 className="mb-4 text-4xl font-bold">Leaderboard</h1>
      <p className="text-lg text-gray-400">See how you stack up among other history buffs.</p>

      {/* Podium */}
      <div className="my-8 flex justify-center gap-6">
        {users.slice(0, 3).map((user) => (
          <LeaderboardPodium key={user.rank} user={user} />
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="my-8 w-[90%] max-w-2xl rounded-lg bg-white p-4 shadow-md">
        {users.map((user) => (
          <div
            key={user.name}
            className={`mb-2 flex items-center justify-between rounded-lg p-3 ${
              user.isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${getRankColor(user.rank)} ${getRankTextColor(user.rank)} font-bold`}>
                {user.rank}
              </span>
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-8 w-8 rounded-full bg-gray-300"
              />
              <span className="font-medium">
                {user.name} {user.isCurrentUser && "(You)"}
              </span>
            </div>
            <span className="font-bold">{user.points} points</span>
          </div>
        ))}
      </div>
    </div>
  )
}
