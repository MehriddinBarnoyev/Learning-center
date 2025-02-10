import { Suspense } from "react"
import Test from "@/components/Test"

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <div className="h-16 border-b" /> {/* Header skeleton */}
          <main className="flex-grow container py-8">
            <div className="space-y-8">
              <div className="h-12 w-1/3 bg-muted rounded-lg" /> {/* Title skeleton */}
              <div className="h-[400px] bg-muted rounded-lg" /> {/* Question card skeleton */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-muted" /> /* Navigation dots skeleton */
                ))}
              </div>
            </div>
          </main>
          <div className="h-16 border-t" /> {/* Footer skeleton */}
        </div>
      }
    >
      <Test />
    </Suspense>
  )
}

