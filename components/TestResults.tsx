"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Clock, Trophy, BarChart, Book, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "./Header"
import Footer from "./Footer"
import { getUserResults, type TestResult, type User } from "@/lib/api"

const subjectIcons = {
  math: BarChart,
  science: Book,
  history: Clock,
}

export default function TestResults() {
  const searchParams = useSearchParams()
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null)
  const [previousResults, setPreviousResults] = useState<TestResult[]>([])
  const [user, setUser] = useState<User | null>(null)
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
            userResults.results
              .filter((r) => r.id !== data.id)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
          )
          setUser(userResults.user)
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
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!currentResult || !user) return null

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
              <CardTitle className="text-3xl font-bold">  {user.name} - Test Results</CardTitle>
              <CardDescription className="text-xl">
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-2xl font-bold">
                    {currentResult.subject.charAt(0).toUpperCase() + currentResult.subject.slice(1)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                  <p className="text-2xl font-bold">
                    {currentResult.difficulty.charAt(0).toUpperCase() + currentResult.difficulty.slice(1)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-cm font-bold">{formatDate(currentResult.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold">{previousResults.length + 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="current" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Result</TabsTrigger>
              <TabsTrigger value="history">Test History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Score</p>
                      <p className={`text-3xl font-bold ${getPerformanceColor(currentResult.score)}`}>
                        {currentResult.score.toFixed(1)}%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
                      <p className="text-3xl font-bold">
                        {currentResult.correctAnswers}/{currentResult.totalQuestions}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                      <p className="text-3xl font-bold">
                        {Math.floor(currentResult.timeSpent / 60)}:
                        {(currentResult.timeSpent % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Performance</p>
                      <p className={`text-3xl font-bold ${getPerformanceColor(currentResult.score)}`}>
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

              <Card>
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      You answered {currentResult.correctAnswers} out of {currentResult.totalQuestions} questions
                      correctly in {Math.floor(currentResult.timeSpent / 60)} minutes and {currentResult.timeSpent % 60}{" "}
                      seconds.
                    </p>
                    <p>
                      Your performance is considered{" "}
                      <span className={`font-bold ${getPerformanceColor(currentResult.score)}`}>
                        {currentResult.score >= 80
                          ? "Excellent"
                          : currentResult.score >= 60
                            ? "Good"
                            : "Needs Improvement"}
                      </span>
                      .{" "}
                      {currentResult.score >= 80
                        ? "Great job! Keep up the good work."
                        : currentResult.score >= 60
                          ? "You're doing well, but there's room for improvement."
                          : "Don't worry, with more practice you can improve your score."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Test History</CardTitle>
                </CardHeader>
                <CardContent>
                  {previousResults.length === 0 ? (
                    <p className="text-muted-foreground">No previous test results found.</p>
                  ) : (
                    <div className="space-y-6">
                      {previousResults.map((result, index) => {
                        const SubjectIcon = subjectIcons[result.subject] || Book
                        return (
                          <Card key={index}>
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="p-2 bg-primary/10 rounded-full">
                                    <SubjectIcon className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {result.subject.charAt(0).toUpperCase() + result.subject.slice(1)} Test
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{result.difficulty}</p>
                                  </div>
                                </div>
                                <Trophy className={`h-8 w-8 ${getPerformanceColor(result.score)}`} />
                              </div>
                              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>Score: {result.score.toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    Time: {Math.floor(result.timeSpent / 60)}:
                                    {(result.timeSpent % 60).toString().padStart(2, "0")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>
                                    Correct: {result.correctAnswers}/{result.totalQuestions}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(result.createdAt)}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
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

