import { Suspense } from "react"
import TestResults from "@/components/TestResults"

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <div className="h-16 border-b" /> {/* Header skeleton */}
          <main className="flex-grow container py-8">
            <div className="space-y-8">
              <div className="h-[200px] bg-muted rounded-lg" /> {/* Results card skeleton */}
              <div className="h-[150px] bg-muted rounded-lg" /> {/* Analysis card skeleton */}
            </div>
          </main>
          <div className="h-16 border-t" /> {/* Footer skeleton */}
        </div>
      }
    >
      <TestResults />
    </Suspense>
  )
}

