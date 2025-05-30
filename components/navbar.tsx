"use client"

import { BookOpen, User } from "lucide-react" // Import icons
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const routes = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "History Guesser", path: "/history-guesser" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-90">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">HistoryQuest</span>
          </div>
        </Link>
        {/* Navigation Menu */}
        <NavigationMenu className="mx-auto">
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.path}>
                <NavigationMenuLink asChild>
                  <Link
                    href={route.path}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-black text-white transition-colors hover:bg-white hover:text-black",
                      pathname === route.path && "bg-gray-700"
                    )}
                  >
                    {route.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Account */}
        <div className="flex items-center gap-2">
          <span className="text-sm">History Explorer</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
