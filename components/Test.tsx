"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Timer, ArrowLeft, ArrowRight } from "lucide-react"
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
import { saveTestResult } from "@/lib/api"

const defaultQuestions = {
  math: [
    {
      id: 1,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4",
    },
    {
      id: 2,
      question: "What is 10 * 5?",
      options: ["40", "45", "50", "55"],
      correct: "50",
    },
    {
      id: 3,
      question: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
      correct: "8",
    },
    {
      id: 4,
      question: "What is 1/4 + 1/2?",
      options: ["1/6", "2/6", "3/4", "5/4"],
      correct: "3/4",
    },
    {
      id: 5,
      question: "What is the value of π (pi) to two decimal places?",
      options: ["3.14", "3.16", "3.18", "3.20"],
      correct: "3.14",
    },
  ],
  science: [
    {
      id: 1,
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correct: "H2O",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      correct: "Mars",
    },
    {
      id: 3,
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Brain", "Liver", "Skin"],
      correct: "Skin",
    },
    {
      id: 4,
      question: "What is the process by which plants make their own food?",
      options: ["Photosynthesis", "Respiration", "Fermentation", "Digestion"],
      correct: "Photosynthesis",
    },
    {
      id: 5,
      question: "What is the smallest unit of matter?",
      options: ["Atom", "Molecule", "Cell", "Particle"],
      correct: "Atom",
    },
  ],
  history: [
    {
      id: 1,
      question: "Who was the first President of the United States?",
      options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
      correct: "George Washington",
    },
    {
      id: 2,
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correct: "1945",
    },
    {
      id: 3,
      question: "Who wrote the Declaration of Independence?",
      options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "John Adams"],
      correct: "Thomas Jefferson",
    },
    {
      id: 4,
      question: "What ancient wonder was located in Alexandria, Egypt?",
      options: ["The Hanging Gardens", "The Colossus of Rhodes", "The Lighthouse", "The Great Pyramid"],
      correct: "The Lighthouse",
    },
    {
      id: 5,
      question: "Who was the first woman to fly solo across the Atlantic Ocean?",
      options: ["Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Jacqueline Cochran"],
      correct: "Amelia Earhart",
    },
  ],
}

export default function Test() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [settings, setSettings] = useState(null)
  const [userId, setUserId] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const settingsData = JSON.parse(decodeURIComponent(searchParams.get("settings") || "{}"))
    const userIdData = searchParams.get("userId")
    setSettings(settingsData)
    setUserId(userIdData)
    setTimeRemaining(settingsData.duration * 60)
  }, [searchParams])

  useEffect(() => {
    if (timeRemaining > 0 && settings) {
      const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeRemaining === 0 && settings) {
      handleFinishTest()
    }
  }, [timeRemaining, settings])

  const questions = settings ? defaultQuestions[settings.subject].slice(0, settings.questionsCount) : []

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: answer }))
  }

  const handleFinishTest = async () => {
    setIsSubmitting(true)
    try {
      const correctAnswers = questions.filter((q) => answers[q.id] === q.correct).length

      const testResult = {
        userId,
        subject: settings.subject,
        difficulty: settings.difficulty,
        score: (correctAnswers / questions.length) * 100,
        timeSpent: settings.duration * 60 - timeRemaining,
        correctAnswers,
        totalQuestions: questions.length,
      }

      const savedResult = await saveTestResult(userId, testResult)
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(savedResult))}&userId=${userId}`)
    } catch (error) {
      console.error("Error saving test result:", error)
      alert("There was an error saving your test result. Please try again.")
      setShowConfirmEnd(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!settings) {
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

  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Test Header */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {settings.subject.charAt(0).toUpperCase() + settings.subject.slice(1)} Test
              </h1>
              <p className="text-muted-foreground">
                {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)} Level
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

          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentQuestion(index)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentQuestion === index
                    ? "bg-primary text-primary-foreground"
                    : answers[questions[index].id]
                      ? "bg-secondary"
                      : "border"
                }`}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
        </motion.div>
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

