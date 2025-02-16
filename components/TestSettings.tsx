"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Book, 
  Clock, 
  BarChart, 
  Calculator,
  Flask,
  Globe2,
  BrainCircuit,
  PenTool,
  ArrowRight,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import Header from "./Header"
import Footer from "./Footer"
import { registerUser, getSubjects, type Subject } from "@/lib/api"

const subjectIcons = [
  Book,          // For general subjects/reading
  Clock,         // For time-based subjects
  BarChart,      // For data analysis
  Calculator,    // For mathematics
  Flask,         // For science
  Globe2,        // For geography/social studies
  BrainCircuit,  // For logic/critical thinking
  PenTool,       // For writing/composition
]

const difficulties = [
  { id: "easy", name: "Easy", description: "Basic concepts and simple questions" },
  { id: "medium", name: "Medium", description: "Moderate difficulty with some challenges" },
  { id: "hard", name: "Hard", description: "Complex problems and advanced concepts" },
]

export default function TestSettings() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [settings, setSettings] = useState({
    subjectId: 0,
    difficulty: "",
  })
  const [user, setUser] = useState({
    full_name: "",
    email: "",
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await getSubjects()
        setSubjects(fetchedSubjects)
      } catch (error) {
        console.error("Error fetching subjects:", error)
      }
    }
    fetchSubjects()
  }, [])

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleStartTest()
    }
  }

  const handleStartTest = async () => {
    setIsRegistering(true)
    try {
      const registeredUser = await registerUser(user.full_name, user.email)
      router.push(`/test?subjectId=${settings.subjectId}&difficulty=${settings.difficulty}&userId=${registeredUser.id}`)
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
        return settings.subjectId !== 0
      case 2:
        return settings.difficulty !== ""
      case 3:
        return user.full_name.trim() !== "" && user.email.trim() !== "" && user.email.includes("@")
      default:
        return false
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container flex justify-center">
          <div className="w-full max-w-[500px]">
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
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
                {[1, 2, 3].map((step) => (
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
                  <div className="grid gap-4 md:grid-cols-3">
                    {subjects.map((subject) => {
                      const Icon = subjectIcons[subject.id - 1] || Book
                      return (
                        <Card
                          key={subject.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            settings.subjectId === subject.id ? "border-primary ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSettings({ ...settings, subjectId: subject.id })}
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
                    <h2 className="text-2xl font-bold">User Registration</h2>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={user.full_name}
                        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                        placeholder="Enter your full name"
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
                  <span>{currentStep === 3 ? (isRegistering ? "Registering..." : "Start Test") : "Next"}</span>
                  {currentStep === 3 ? <ArrowRight className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}