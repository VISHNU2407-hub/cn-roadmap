export type Category =
  | 'Fundamentals'
  | 'Transport'
  | 'Application'
  | 'IP & Routing'
  | 'Security'
  | 'Revision'

export interface Term {
  term: string
  def: string
}

export interface InterviewQuestion {
  q: string
  a: string
  topic: Category
}

export type DiagramKind =
  | 'osi'
  | 'tcpip'
  | 'encapsulation'
  | 'handshake'
  | 'termination'
  | 'dns'
  | 'webflow'

export interface Lesson {
  id: number // 1..28
  week: 1 | 2 | 3 | 4
  topic: string
  category: Category
  objective: string
  subtopics: string[] // exactly three
  checklist: string[]
  summary: string // paragraphs separated by \n\n
  terms: Term[]
  questions: InterviewQuestion[] // at least three
  quiz?: InterviewQuestion[] // for revision/mock/assessment activity days
  diagram?: DiagramKind
}

export interface WeekMeta {
  week: 1 | 2 | 3 | 4
  title: string
  description: string
}

// ---- persisted progress ----

export type Theme = 'dark' | 'light'

export interface WrongAnswer {
  question: string
  topic: Category
  date: string // ISO date
}

export type MistakeVerdict = 'correct' | 'missed'

export interface AttemptRecord {
  verdict: MistakeVerdict
  date: string
}

export interface AppState {
  completed: number[] // lesson ids marked complete
  notes: Record<number, string> // lessonId -> notes
  secondsStudied: Record<number, number> // lessonId -> seconds studied via timer
  wrongAnswers: WrongAnswer[]
  attempts: Record<string, AttemptRecord> // question text -> latest verdict
  streak: number
  lastStudyDate: string | null // YYYY-MM-DD
  theme: Theme
  celebratedWeeks: number[] // weeks whose completion was already celebrated
}

export interface TimerState {
  lessonId: number
  phaseIndex: number // 0..2
  secondsLeft: number
  running: boolean
  startedAt: number | null // epoch ms when running started (or when last tick saved)
}

export const STUDY_BLOCKS = [
  { minutes: 35, label: 'Learn', hint: 'Watch / read the lesson and understand the concepts' },
  { minutes: 10, label: 'Notes', hint: 'Write short notes and sketch diagrams from memory' },
  { minutes: 15, label: 'Recall', hint: 'Answer the interview questions without looking at notes' },
] as const

export const WEEKS: WeekMeta[] = [
  { week: 1, title: 'Networking fundamentals', description: 'Models, devices, addressing and how data moves.' },
  { week: 2, title: 'Transport & application layers', description: 'TCP, UDP, HTTP(S) and the protocols above the transport.' },
  { week: 3, title: 'IP, routing & web requests', description: 'Addressing, subnetting, routing and the full request flow.' },
  { week: 4, title: 'Interview preparation', description: 'Revision drills, a mock interview and a final assessment.' },
]
