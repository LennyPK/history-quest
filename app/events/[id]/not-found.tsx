import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EventNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Event Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The event you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/events" className="text-primary inline-flex items-center hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Link>
    </div>
  )
}
