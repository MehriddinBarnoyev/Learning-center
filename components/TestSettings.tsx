"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Book, Clock, BarChart, ChevronRight, ArrowRight, Globe, Atom, Beaker, Microscope, Code, DollarSign, Notebook, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import Header from "./Header"
import Footer from "./Footer"
import { registerUser } from "@/lib/api"

const subjects = [
  { id: "math", name: "Mathematics", icon: BarChart },
  { id: "history", name: "History", icon: Clock },
  { id: "science", name: "Science", icon: Book },
  { id: "english", name: "English", icon: Book },
  // Add more subjects here with diffrerent icons

  { id: "geography", name: "Geography", icon: Globe },
  { id: "physics", name: "Physics", icon: Atom },
  { id: "chemistry", name: "Chemistry", icon: Beaker },
  { id: "biology", name: "Biology", icon: Microscope },
  { id: "computer-science", name: "Computer Science", icon: Code },
  { id: "economics", name: "Economics", icon: DollarSign },
  { id: "business", name: "Business", icon: Notebook },
  { id: "accounting", name: "Accounting", icon: Calculator },


]

const difficulties = [
  { id: "beginner", name: "Beginner", description: "Basic concepts and simple questions" },
  { id: "intermediate", name: "Intermediate", description: "Moderate difficulty with some challenges" },
  { id: "advanced", name: "Advanced", description: "Complex problems and advanced concepts" },
]

export default function TestSettings() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [settings, setSettings] = useState({
    subject: "",
    difficulty: "",
    duration: 30,
    questionsCount: 10,
  })
  const [user, setUser] = useState({
    name: "",
    email: "",
  })
  const [isRegistering, setIsRegistering] = useState(false)

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      handleStartTest()
    }
  }

  const handleStartTest = async () => {
    setIsRegistering(true)
    try {
      const registeredUser = await registerUser(user.name, user.email)
      router.push(`/test?settings=${encodeURIComponent(JSON.stringify(settings))}&userId=${registeredUser.id}`)
    } catch (error) {
      console.error("Error registering user:", error)
      alert("There was an error registering. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return settings.subject !== ""
      case 2:
        return settings.difficulty !== ""
      case 3:
        return settings.duration >= 10 && settings.questionsCount >= 5
      case 4:
        return true
      case 5:
        return user.name.trim() !== "" && user.email.trim() !== "" && user.email.includes("@")
      default:
        return false
    }
  }

  return (
    <div className="flex min-h-screen flex-col p-5">
      <Header />
      <main className="flex-grow container max-w-full py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Test Settings</h1>
            <p className="text-muted-foreground">Customize your test experience by selecting your preferences</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
            {[1, 2, 3, 4, 5].map((step) => (
              <motion.div
                key={step}
                initial={false}
                animate={{
                  scale: currentStep >= step ? 1.1 : 1,
                  backgroundColor: currentStep >= step ? "var(--primary)" : "var(--muted)",
                }}
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-primary-foreground"
              >
                {step}
              </motion.div>
            ))}
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentStep === 1 && (
              <div className="grid gap-4 md:grid-cols-6">
                {subjects.map((subject) => {
                  const Icon = subject.icon
                  return (
                    <Card
                      key={subject.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        settings.subject === subject.id ? "border-primary ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSettings({ ...settings, subject: subject.id })}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Icon className="h-12 w-12 mb-4" />
                        <h3 className="font-semibold">{subject.name}</h3>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {currentStep === 2 && (
              <RadioGroup
                value={settings.difficulty}
                onValueChange={(value) => setSettings({ ...settings, difficulty: value })}
                className="grid gap-4"
              >
                {difficulties.map((difficulty) => (
                  <motion.div key={difficulty.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor={difficulty.id}
                      className="flex flex-col space-y-1 cursor-pointer rounded-lg border p-4 [&:has(:checked)]:border-primary"
                    >
                      <RadioGroupItem value={difficulty.id} id={difficulty.id} className="sr-only" />
                      <span className="font-semibold">{difficulty.name}</span>
                      <span className="text-sm text-muted-foreground">{difficulty.description}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Test Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="10"
                    max="120"
                    value={settings.duration}
                    onChange={(e) => setSettings({ ...settings, duration: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questions">Number of Questions</Label>
                  <Input
                    id="questions"
                    type="number"
                    min="5"
                    max="50"
                    value={settings.questionsCount}
                    onChange={(e) => setSettings({ ...settings, questionsCount: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Review Settings</h2>
                <div className="grid gap-2">
                  <p>
                    <strong>Subject:</strong> {subjects.find((s) => s.id === settings.subject)?.name}
                  </p>
                  <p>
                    <strong>Difficulty:</strong> {difficulties.find((d) => d.id === settings.difficulty)?.name}
                  </p>
                  <p>
                    <strong>Duration:</strong> {settings.duration} minutes
                  </p>
                  <p>
                    <strong>Number of Questions:</strong> {settings.questionsCount}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">User Registration</h2>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button onClick={handleNext} disabled={!isStepValid() || isRegistering} className="space-x-2">
              <span>{currentStep === 5 ? (isRegistering ? "Registering..." : "Start Test") : "Next"}</span>
              {currentStep === 5 ? <ArrowRight className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

