"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, User } from "lucide-react" // Import icons

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const routes = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "History Guesser", path: "/history-guesser" }
]

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <div className="border-b bg-black text-white">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold">HistoryQuest</span>
        </div>
        
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
                      "bg-black text-white hover:bg-white hover:text-black transition-colors",
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
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar