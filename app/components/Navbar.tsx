"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
    <div className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.path}>
                <Link href={route.path} legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === route.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    {route.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

export default Navbar