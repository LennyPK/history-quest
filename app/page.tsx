import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BadgeCheck, Clock, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    // <div className="flex min-h-screen justify-center">
    <div>
      {/* Hero Section - Full Width */}
      <header className="relative mb-12 w-full py-40 text-center">
        {/* Background Image */}
        <Image
          src="/images/main-bg.png"
          alt="Historical classroom"
          fill
          className="absolute inset-0 bg-cover bg-center bg-no-repeat object-cover brightness-[0.3]"
        />

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            Welcome to HistoryQuest!
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed md:text-lg">
            Discover important events that shaped our world through interactive lessons and quizzes.
            <br />
            Select a time period below to begin your journey.
          </p>
        </div>
      </header>

      {/* Rest of the content with container padding */}
      <div className="mb-30 container mx-auto max-w-7xl px-6 pb-6">
        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* World War II */}
          <Card className="transition-shadow hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold">World War II</CardTitle>
              <CardDescription>1939-1945</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/ww2.png"
                alt="World War II"
                width={800}
                height={100}
                className="mb-4 h-64 w-full rounded-md object-cover"
              />
              <p className="text-muted-foreground text-sm">
                Explore the major events, battles, and impacts of the Second World War through
                interactive timelines and maps.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/events/world-war-two" className="mt-auto w-full">
                <button className="mt-auto w-full cursor-pointer rounded border border-transparent bg-black px-4 py-2 font-semibold text-white transition hover:border-black hover:bg-gray-100 hover:text-black">
                  Explore Event
                </button>
              </Link>
            </CardFooter>
          </Card>

          {/* French Revolution */}
          <Card className="transition-shadow hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold">French Revolution</CardTitle>
              <CardDescription>c. 1789-1799</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/french-revolution.png"
                alt="French Revolution"
                width={800}
                height={100}
                className="mb-4 h-64 w-full rounded-md object-cover"
              />
              <p className="text-muted-foreground text-sm">
                Political and social upheaval that transformed France and spread revolutionary
                ideas.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/events/french-revolution" className="mt-auto w-full">
                <button className="mt-auto w-full cursor-pointer rounded border border-transparent bg-black px-4 py-2 font-semibold text-white transition hover:border-black hover:bg-gray-100 hover:text-black">
                  Explore Event
                </button>
              </Link>
            </CardFooter>
          </Card>
        </section>

        {/* How History Quest Works */}
        <section className="mb-12 rounded-lg bg-orange-100 p-8 text-center">
          <h2 className="mb-8 text-2xl font-bold">How History Quest Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <span className="h-15 w-15 mb-4 flex items-center justify-center rounded-full bg-gray-200">
                <Clock className="text-primary h-9 w-9" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">Interactive Timelines</h3>
              <p className="text-muted-foreground text-sm">
                Explore events chronologically with interactive timelines that highlight key
                moments.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <span className="h-15 w-15 mb-4 flex items-center justify-center rounded-full bg-gray-200">
                <Globe className="text-primary h-9 w-9" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">Dynamic Maps</h3>
              <p className="text-muted-foreground text-sm">
                See where events took place with interactive maps that provide geographical context.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <span className="h-15 w-15 mb-4 flex items-center justify-center rounded-full bg-gray-200">
                <BadgeCheck className="text-primary h-9 w-9" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">Knowledge Checks</h3>
              <p className="text-muted-foreground text-sm">
                Test your understanding with quick quizzes and interactive challenges after
                exploring.
              </p>
            </div>
          </div>
        </section>

        {/* Ready to Start Section */}
        <div className="mt-0 text-center">
          <h1 className="mb-4 py-1 text-3xl font-bold">Ready to Start Your Historical Journey?</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Choose an event above or browse our complete collection to begin exploring history in an
            interactive and engaging way.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/events"
              className="w-60 rounded bg-black px-4 py-2 font-semibold text-white transition hover:border-black hover:bg-gray-100 hover:text-black"
            >
              Browse All Events
            </Link>

            <span className="text-gray-500">or</span>

            <Link
              href="/history-guesser"
              className="w-60 rounded bg-black px-4 py-2 font-semibold text-white transition hover:border-black hover:bg-gray-100 hover:text-black"
            >
              Try out HistoryGuesser!
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
