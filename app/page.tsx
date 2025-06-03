import { BadgeCheck, Clock, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-7xl px-4 text-center">
        <div className="relative mb-12 w-full">
            <div className="absolute inset-0">
              <Image
                src="/images/main-bg.png"
                alt="Historical classroom"
                fill
                className="object-cover brightness-[0.3]"
                priority
              />
            </div>
            <div className="relative px-4 py-16">
              <h1 className="mb-4 text-5xl font-bold text-white">Welcome to HistoryQuest!</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-200">
                Discover important events that shaped our world through interactive lessons and quizzes.
                <br />
                Select a time period below to begin your journey.
              </p>
            </div>
          </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Event Box 1 */}
          <div className="flex flex-col items-center rounded-lg border bg-white p-6 shadow transition">
            <h2 className="mb-1 w-full text-left text-xl font-bold">World War II</h2>
            <span className="mb-3 w-full text-left text-sm text-gray-500">1939–1945</span>
            <div className="relative mb-4 flex h-48 w-full items-center justify-center rounded bg-gray-100">
              <Image
                src="/images/ww2.png"
                alt="World War II"
                fill
                className="rounded object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p className="mb-4 w-full text-left text-sm text-gray-600">
              Explore the major conflicts that shaped the 20th century.
            </p>
            <button className="mt-auto w-full rounded border border-transparent bg-black px-4 py-2 font-semibold text-white transition hover:border-black hover:bg-gray-100 hover:text-black">
              Explore Event
            </button>
          </div>
          {/* Event Box 2 */}
          <div className="flex flex-col items-center rounded-lg border bg-white p-6 shadow transition">
            <h2 className="mb-1 w-full text-left text-xl font-bold">French Revolution</h2>
            <span className="mb-3 w-full text-left text-sm text-gray-500">c. 1789-1799</span>
            <div className="relative mb-4 flex h-48 w-full items-center justify-center rounded bg-gray-100">
              <Image
                src="/images/french-revolution.png"
                alt="French Revolution"
                fill
                className="rounded object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p className="mb-4 w-full text-left text-sm text-gray-600">
              Political and social upheaval that transformed France and spread revolutionary ideas.
            </p>
            <button className="mt-auto w-full rounded border border-transparent bg-black px-4 py-2 font-semibold text-white transition hover:border-black hover:bg-gray-100 hover:text-black">
              Explore Event
            </button>
          </div>
        </div>

        {/* How History Quest Works Section */}
        <div className="mb-4 mt-8 rounded-lg bg-gray-50 px-8 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold">How History Quest Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <Clock className="h-6 w-6 text-gray-700" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">Interactive Timelines</h3>
              <p className="text-sm text-gray-600">
                Explore events chronologically with interactive timelines that highlight key
                moments.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <Globe className="h-6 w-6 text-gray-700" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">Dynamic Maps</h3>
              <p className="text-sm text-gray-600">
                See where events took place with interactive maps that provide geographical context.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <BadgeCheck className="h-6 w-6 text-gray-700" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">Knowledge Checks</h3>
              <p className="text-sm text-gray-600">
                Test your understanding with quick quizzes and interactive challenges after
                exploring.
              </p>
            </div>
          </div>
        </div>
        {/* Ready to Start Section */}
        <div className="mt-0 text-center">
          <h1 className="mb-4 py-1 text-3xl font-bold">Ready to Start Your Historical Journey?</h1>
          <p className="mb-8 text-lg">
            Choose an event above or browse our complete collection to begin exploring history in an
            interactive and engaging way.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/events"
              className="w-60 rounded bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800"
            >
              Browse All Events
            </Link>

            <span className="text-gray-500">or</span>

            <Link
              href="/history-guesser"
              className="w-60 rounded bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800"
            >
              Try out HistoryGuesser!
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
