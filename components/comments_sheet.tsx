"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, MoreHorizontal, Reply } from "lucide-react"
import { useState } from "react"

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
}

interface CommentsSheetProps {
  eventId?: string
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: "Sarah Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "This event really changed the course of history. The timeline section provides great context for understanding the broader implications.",
    timestamp: "2 hours ago",
    likes: 12,
    replies: [
      {
        id: "1-1",
        author: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "Agreed! The interactive map really helps visualize the scope of the conflict.",
        timestamp: "1 hour ago",
        likes: 3,
      },
    ],
  },
  {
    id: "2",
    author: "Alex Rodriguez",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "I found the quiz challenging but educational. Great way to test understanding of the key events.",
    timestamp: "4 hours ago",
    likes: 7,
  },
  {
    id: "3",
    author: "Emma Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "The sources section is incredibly thorough. Perfect for anyone wanting to dive deeper into the research.",
    timestamp: "6 hours ago",
    likes: 15,
  },
]

export default function CommentsSheet({ eventId = "default" }: CommentsSheetProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "likes">("recent")
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleLike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const isLiked = likedComments.has(commentId)
          return {
            ...comment,
            likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        return comment
      })
    )

    setLikedComments((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(commentId)) {
        newLiked.delete(commentId)
      } else {
        newLiked.add(commentId)
      }
      return newLiked
    })
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "likes") {
      return b.likes - a.likes
    } else {
      // For "recent" sorting, we'll use the timestamp
      // Since we're using mock data with "hours ago", we'll sort by the numeric value
      const getTimeValue = (timestamp: string) => {
        const match = timestamp.match(/(\d+)/)
        return match ? parseInt(match[1]) : 0
      }
      return getTimeValue(a.timestamp) - getTimeValue(b.timestamp)
    }
  })

  // Update the CommentItem component to match the design
  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-2 ${isReply ? "ml-12 pt-3" : ""}`}>
      <div className="flex items-start space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-medium">
          {comment.author
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold">{comment.author}</h4>
            <span className="text-muted-foreground text-sm">{comment.timestamp}</span>
          </div>
          <p className="text-foreground text-base leading-relaxed">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center space-x-1 transition-colors ${
                likedComments.has(comment.id)
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`h-5 w-5 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
              <span>{comment.likes}</span>
            </button>
            <button className="text-muted-foreground flex items-center space-x-1">
              <Reply className="h-5 w-5" />
              <span>Reply</span>
            </button>
            <button className="text-muted-foreground ml-auto flex items-center">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Comments</span>
          <span className="text-muted-foreground text-xs">({comments.length})</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] p-0 sm:w-[540px]">
        <SheetHeader>
          <div className="p-6 pb-0">
            <SheetTitle>Discussion</SheetTitle>
            <SheetDescription>Join the conversation about this historical event.</SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex h-[calc(100vh-8rem)] flex-col">
          <div className="space-y-6 px-6">
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment" className="font-medium">
                  Add your thoughts
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share your insights about this event..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] border-2"
                />
              </div>
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Post Comment
              </Button>
            </form>

            <div className="flex items-center justify-between">
              <Separator className="flex-1" />
              <div className="mx-4">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as "recent" | "likes")}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="flex-1" />
            </div>
          </div>

          {/* Comments List */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 pr-4">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <CommentItem comment={comment} />
                  {comment !== sortedComments[sortedComments.length - 1] && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
