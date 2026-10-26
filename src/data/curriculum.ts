import type { Lesson } from '../types'
import { LESSONS_PART1 } from './lessons1'
import { LESSONS_PART2 } from './lessons2'

export const LESSONS: Lesson[] = [...LESSONS_PART1, ...LESSONS_PART2]

export function getLesson(id: number): Lesson {
  return LESSONS[id - 1]
}

export const ALL_QUESTIONS = LESSONS.flatMap((l) =>
  [...l.questions, ...(l.quiz ?? [])].map((q) => ({ ...q, lessonId: l.id, day: l.id })),
)
