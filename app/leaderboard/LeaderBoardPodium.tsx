type PodiumEntry = {
  name: string
  points: number
  rank: number
  profileImage: string
}

interface PodiumProps {
  user: PodiumEntry
}

function getRankStyles(rank: number): { bg: string; text: string } {
  switch (rank) {
    case 1:
      return { bg: "bg-yellow-400", text: "text-white" }
    case 2:
      return { bg: "bg-gray-300", text: "text-black" }
    case 3:
      return { bg: "bg-amber-600", text: "text-white" }
    default:
      return { bg: "bg-gray-200", text: "text-black" }
  }
}

export default function LeaderboardPodium({ user }: PodiumProps) {
  const { bg, text } = getRankStyles(user.rank)
  return (
    <div className="flex w-40 flex-col items-center justify-center overflow-hidden text-center">
      <div className="mb-2 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-300">
        <img src={user.profileImage} alt={user.name} className="h-8 w-8 object-contain" />
      </div>
      <div className="text-sm font-bold">{user.name}</div>
      <div className="mt-1 text-sm font-bold">{user.points} points</div>
      <div className={`mt-2 h-8 w-8 rounded-full px-2 py-1 text-sm font-bold ${bg} ${text}`}>
        {user.rank}
      </div>
    </div>
  )
}
