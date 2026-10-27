export type Category =
  | 'Fundamentals'
  | 'Transport'
  | 'Application'
  | 'IP & Routing'
  | 'Security'
  | 'Revision'

export interface Lesson {
  id: number // 1..28
  week: 1 | 2 | 3 | 4
  topic: string
  category: Category
  objective: string
  subtopics: string[] // exactly three
  checklist: string[]
}

export interface WeekMeta {
  week: 1 | 2 | 3 | 4
  title: string
  description: string
}

export type Theme = 'system' | 'dark' | 'light'
export type ResolvedTheme = 'dark' | 'light'

export interface AppState {
  completed: number[] // lesson ids marked complete
  streak: number
  lastStudyDate: string | null // YYYY-MM-DD (local)
  theme: Theme
  checklist: Record<string, boolean> // `d${lessonId}:${text}` → ticked
}

export const WEEKS: WeekMeta[] = [
  { week: 1, title: 'Networking fundamentals', description: 'Models, devices, addressing and how data moves.' },
  { week: 2, title: 'Transport & application layers', description: 'TCP, UDP, HTTP(S) and the protocols above the transport.' },
  { week: 3, title: 'IP, routing & web requests', description: 'Addressing, subnetting, routing and the full request flow.' },
  { week: 4, title: 'Interview preparation', description: 'Revision drills, a mock interview and a final assessment.' },
]

export const TOTAL_DAYS = 28
