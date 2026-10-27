import type { Lesson } from '../types'
import { LESSONS } from './lessons'

export { LESSONS }

export function getLesson(id: number): Lesson {
  return LESSONS[id - 1]
}
