export interface Course {
  id: string
  term: string
  name: string
  type: 'core' | 'elective' | 'project'
  description: string
  details: string
} 