import axios from "axios"

const API_URL = "http://localhost:4506"

export interface User {
  id: number
  full_name: string
  email: string
}

export interface TestResult {
  id: number
  student_id: number
  subject_id: number
  score: number
  time_spent: number
  correct_answers: number
  total_questions: number
  created_at: string
}

export interface Test {
  id: string
  subject: string
  difficulty: string
}

export interface Question {
  id: number
  subject_id: number
  question: string
  options: string[]
  correct_option: string
  created_at: string
  created_by: number
}

export interface Subject {
  id: number
  name: string
}

export async function registerUser(full_name: string, email: string): Promise<User> {
  const response = await axios.post<User>(`${API_URL}/students`, { full_name, email })
  return response.data
}

export async function getTests(): Promise<Test[]> {
  const response = await axios.get<Test[]>(`${API_URL}/tests`)
  return response.data
}

export async function getTest(id: string): Promise<Test> {
  const response = await axios.get<Test>(`${API_URL}/test/${id}`)
  return response.data
}

export async function getQuestions(subjectId: number, difficulty: string): Promise<Question[]> {
  const response = await axios.get<Question[]>(`${API_URL}/subjects/${subjectId}/${difficulty}`)
  return response.data
}

export async function getStudents(): Promise<User[]> {
  const response = await axios.get<User[]>(`${API_URL}/students`)
  return response.data
}

export async function saveTestResult(result: Omit<TestResult, "id" | "created_at">): Promise<TestResult> {
  const response = await axios.post<TestResult>(`${API_URL}/results`, result)
  return response.data
}

export async function getResults(): Promise<TestResult[]> {
  const response = await axios.get<TestResult[]>(`${API_URL}/results`)
  return response.data
}

export async function getSubjects(): Promise<Subject[]> {
  const response = await axios.get<Subject[]>(`${API_URL}/subjects`)
  return response.data
}

export async function getSubject(id: number): Promise<Subject> {
  const response = await axios.get<Subject[]>(`${API_URL}/subjects/${id}`)
  return response.data[0]
}

