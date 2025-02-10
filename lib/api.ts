import axios from "axios"

const API_URL = "https://67a7304e203008941f66de89.mockapi.io"

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  "test-results": TestResult[]
}

export interface TestResult {
  id: string
  userId: string
  subject: string
  difficulty: string
  score: number
  timeSpent: number
  correctAnswers: number
  totalQuestions: number
  createdAt: string
}

export async function registerUser(name: string, email: string): Promise<User> {
  const response = await axios.post<User>(`${API_URL}/tested-users`, {
    name,
    email,
    "test-results": [],
  })
  return response.data
}

export async function saveTestResult(
  userId: string,
  result: Omit<TestResult, "id" | "createdAt">,
): Promise<TestResult> {
  try {
    // First, get the current user data
    const userResponse = await axios.get<User>(`${API_URL}/tested-users/${userId}`)
    const user = userResponse.data

    // Create the new test result
    const testResult = {
      ...result,
      createdAt: new Date().toISOString(),
    }

    // Update the user's test results
    const updatedTestResults = [...user["test-results"], testResult]

    // Update the user with the new test results
    await axios.put(`${API_URL}/tested-users/${userId}`, {
      ...user,
      "test-results": updatedTestResults,
    })

    return testResult
  } catch (error) {
    console.error("Error saving test result:", error)
    throw new Error("Failed to save test result. Please try again.")
  }
}

export async function getUserResults(userId: string): Promise<TestResult[]> {
  try {
    const response = await axios.get<User>(`${API_URL}/tested-users/${userId}`)
    return response.data["test-results"] || []
  } catch (error) {
    console.error("Error fetching user results:", error)
    throw new Error("Failed to fetch test results. Please try again.")
  }
}

