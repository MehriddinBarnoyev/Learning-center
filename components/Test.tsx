"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Timer, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Header from "./Header"
import Footer from "./Footer"
import { getQuestions, saveTestResult, type Question } from "@/lib/api"

export default function Test() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes by default
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const subjectId = searchParams.get("subjectId")
    const difficulty = searchParams.get("difficulty")

    if (subjectId && difficulty) {
      const fetchQuestions = async () => {
        try {
          const fetchedQuestions = await getQuestions(Number.parseInt(subjectId), difficulty)
          setQuestions(fetchedQuestions)
        } catch (error) {
          console.error("Error fetching questions:", error)
          alert("There was an error loading the test questions. Please try again.")
        }
      }
      fetchQuestions()
    } else {
      alert("Invalid test parameters. Please go back and try again.")
      router.push("/test-settings")
    }
  }, [searchParams, router])

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeRemaining === 0) {
      handleFinishTest()
    }
  }, [timeRemaining])

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: answer }))
  }

  const handleFinishTest = async () => {
    setIsSubmitting(true)
    try {
      const correctAnswers = questions.filter((q) => answers[q.id] === q.correct_option).length
      const testResult = {
        student_id: Number.parseInt(searchParams.get("userId") || "0"),
        subject_id: Number.parseInt(searchParams.get("subjectId") || "0"),
        score: (correctAnswers / questions.length) * 100,
        time_spent: 1800 - timeRemaining,
        correct_answers: correctAnswers,
        total_questions: questions.length,
      }

      const savedResult = await saveTestResult(testResult)
      router.push(`/results?resultId=${savedResult.id}`)
    } catch (error) {
      console.error("Error saving test result:", error)
      alert("There was an error saving your test result. Please try again.")
      setShowConfirmEnd(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container py-8">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Loading test...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const progress = (Object.keys(answers).length / questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container flex gap-8">
          {/* Test Progress Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-8 space-y-4">
              <h3 className="font-semibold">Test Progress</h3>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      currentQuestion === index
                        ? "bg-primary text-primary-foreground"
                        : answers[question.id]
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full border">
                        {answers[question.id] ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      <span className="text-sm truncate">{question.question.substring(0, 30)}...</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex justify-center">
            <div className="w-full max-w-[500px] space-y-8">
              {/* Test Header */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Test</h1>
                  <p className="text-muted-foreground">
                    {searchParams.get("difficulty")?.charAt(0).toUpperCase() + searchParams.get("difficulty")?.slice(1)}{" "}
                    Level
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    <span className="font-mono text-lg">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <Progress value={progress} className="w-[100px]" />
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Question {currentQuestion + 1} of {questions.length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-lg">{questions[currentQuestion].question}</p>
                      <RadioGroup value={answers[questions[currentQuestion].id] || ""} onValueChange={handleAnswer}>
                        {questions[currentQuestion].options.map((option, index) => (
                          <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Label
                              htmlFor={`option-${index}`}
                              className="flex items-center space-x-2 cursor-pointer rounded-lg border p-4 [&:has(:checked)]:border-primary"
                            >
                              <RadioGroupItem value={option} id={`option-${index}`} />
                              <span>{option}</span>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      {currentQuestion < questions.length - 1 ? (
                        <Button
                          onClick={() => setCurrentQuestion((prev) => prev + 1)}
                          disabled={!answers[questions[currentQuestion].id]}
                        >
                          Next
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setShowConfirmEnd(true)}
                          disabled={Object.keys(answers).length !== questions.length}
                        >
                          Finish Test
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Confirm End Dialog */}
      <AlertDialog open={showConfirmEnd} onOpenChange={setShowConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finish Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to finish the test? You cannot change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinishTest} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

