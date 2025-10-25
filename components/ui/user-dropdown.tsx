"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export function UserDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Clear sessionStorage to remove progress and points
    sessionStorage.removeItem("eventProgress")
    sessionStorage.removeItem("userPoints")

    // Optionally close dropdown and navigate away if needed
    setOpen(false)
    // You can also redirect or show a confirmation here
  }

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 text-white transition"
      >
        {/* Plain text with no background */}
        <span className="text-sm text-white">History Explorer</span>

        {/* Icon with background */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
          <User className="h-5 w-5 text-white" />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-md border bg-white text-sm text-black shadow-lg">
          <Link href="/profile" className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Profile
          </Link>

          <button
            type="button"
            className="flex w-full cursor-not-allowed items-center gap-2 px-4 py-2 text-left transition hover:bg-gray-100"
          >
            Settings
          </button>

          <hr className="my-1" />
          <button
            onClick={handleLogout}
            className="w-full cursor-pointer px-4 py-2 text-left text-red-500 hover:bg-red-100"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
