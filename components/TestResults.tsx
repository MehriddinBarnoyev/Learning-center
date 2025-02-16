"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "./Header"
import Footer from "./Footer"
import { getResults, type TestResult } from "@/lib/api"

export default function TestResults() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<TestResult | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      const resultId = searchParams.get("resultId")
      if (resultId) {
        try {
          const results = await getResults()
          const fetchedResult = results.find((r) => r.id === Number.parseInt(resultId))
          if (fetchedResult) {
            setResult(fetchedResult)
          } else {
            console.error("Result not found")
          }
        } catch (error) {
          console.error("Error fetching result:", error)
        }
      }
    }
    fetchResult()
  }, [searchParams])

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container py-8">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Score</p>
                  <p className={`text-3xl font-bold ${getPerformanceColor(result.score)}`}>
                    {result.score.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
                  <p className="text-3xl font-bold">
                    {result.correct_answers}/{result.total_questions}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                  <p className="text-3xl font-bold">
                    {Math.floor(result.time_spent / 60)}:{(result.time_spent % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  You answered {result.correct_answers} out of {result.total_questions} questions correctly in{" "}
                  {Math.floor(result.time_spent / 60)} minutes and {result.time_spent % 60} seconds.
                </p>
                <p>
                  Your performance is considered{" "}
                  <span className={`font-bold ${getPerformanceColor(result.score)}`}>
                    {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : "Needs Improvement"}
                  </span>
                  .{" "}
                  {result.score >= 80
                    ? "Great job! Keep up the good work."
                    : result.score >= 60
                      ? "You're doing well, but there's room for improvement."
                      : "Don't worry, with more practice you can improve your score."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/test-settings">
                Take Another Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

