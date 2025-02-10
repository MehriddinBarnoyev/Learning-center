"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "./Header"
import Footer from "./Footer"
import { getUserResults, type TestResult } from "@/lib/api"

export default function TestResults() {
  const searchParams = useSearchParams()
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null)
  const [previousResults, setPreviousResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = JSON.parse(decodeURIComponent(searchParams.get("data")))
        const userId = searchParams.get("userId")
        setCurrentResult(data)

        if (userId) {
          const userResults = await getUserResults(userId)
          setPreviousResults(
            userResults
              .filter((r) => r.id !== data.id)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
          )
        }
      } catch (error) {
        console.error("Error loading results:", error)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container py-8">
          <div className="flex items-center justify-center">
            <p>Loading results...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!currentResult) return null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Tabs defaultValue="current" className="space-y-8">
            <TabsList>
              <TabsTrigger value="current">Current Result</TabsTrigger>
              <TabsTrigger value="history">Test History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-8">
              {/* Current Result Summary */}
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Test Results</CardTitle>
                  <p className="text-muted-foreground">
                    {currentResult.subject.charAt(0).toUpperCase() + currentResult.subject.slice(1)} Test (
                    {currentResult.difficulty})
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold">{currentResult.score.toFixed(1)}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                      <p className="text-2xl font-bold">
                        {currentResult.correctAnswers}/{currentResult.totalQuestions}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Time Spent</p>
                      <p className="text-2xl font-bold">
                        {Math.floor(currentResult.timeSpent / 60)}:
                        {(currentResult.timeSpent % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className="text-2xl font-bold">
                        {currentResult.score >= 80
                          ? "Excellent"
                          : currentResult.score >= 60
                            ? "Good"
                            : "Needs Improvement"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              {/* Previous Results */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Previous Tests</h2>
                {previousResults.length === 0 ? (
                  <p className="text-muted-foreground">No previous test results found.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {previousResults.map((result, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">
                                {result.subject.charAt(0).toUpperCase() + result.subject.slice(1)} Test
                              </h3>
                              <p className="text-sm text-muted-foreground">{result.difficulty}</p>
                            </div>
                            <Trophy
                              className={`h-5 w-5 ${
                                result.score >= 80
                                  ? "text-yellow-500"
                                  : result.score >= 60
                                    ? "text-blue-500"
                                    : "text-gray-500"
                              }`}
                            />
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{result.score.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {Math.floor(result.timeSpent / 60)}:
                                {(result.timeSpent % 60).toString().padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Taken on {new Date(result.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

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

