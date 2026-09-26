export type Recommendation = {
  id: string
  name: string
  initials: string
  role: string
  institution: string
  date: string
  recommendation: string
  previewText: string
  fullText: string
  avatar: string
}

export const recommendations: Recommendation[] = [
  {
    id: 'rec-01',
    name: 'Jobi Babu',
    initials: 'JB',
    role: 'Assistant Professor',
    institution: 'Marian College Kuttikkanam (Autonomous)',
    date: 'September 24, 2026',
    recommendation:
      'As the Research Director at Marian College Kuttikkanam (Autonomous), I had the opportunity to work closely with Mr. Sijomon P. S. in designing and developing the Marian Research Portal, a centralized platform for managing the institution’s research activities. Sijomon demonstrated strong technical competence, excellent problem-solving ability, and a clear understanding of institutional requirements. His initiative, adaptability, and ownership throughout the project were particularly commendable. He effectively transformed academic and administrative requirements into a practical digital solution.\n\nI highly recommend Sijomon for his technical capability, commitment, and potential to successfully undertake and deliver technology-driven projects. I wish him continued success in his academic and professional journey.',
    previewText:
      'As the Research Director at Marian College Kuttikkanam (Autonomous), I had the opportunity to work closely with Mr. Sijomon P. S. in designing and developing the Marian Research Portal, a centralized platform for managing the institution’s research activities. Sijomon demonstrated strong technical competence, excellent problem-solving ability, and a clear understanding of institutional requirements.',
    fullText:
      'As the Research Director at Marian College Kuttikkanam (Autonomous), I had the opportunity to work closely with Mr. Sijomon P. S. in designing and developing the Marian Research Portal, a centralized platform for managing the institution’s research activities. Sijomon demonstrated strong technical competence, excellent problem-solving ability, and a clear understanding of institutional requirements. His initiative, adaptability, and ownership throughout the project were particularly commendable. He effectively transformed academic and administrative requirements into a practical digital solution.\n\nI highly recommend Sijomon for his technical capability, commitment, and potential to successfully undertake and deliver technology-driven projects. I wish him continued success in his academic and professional journey.',
    avatar: '/recommendations/jobi-babu.webp',
  },
  {
    id: 'rec-02',
    name: 'Kochumol Abraham',
    initials: 'KA',
    role: 'Assistant Professor',
    institution: 'Marian College Kuttikkanam (Autonomous)',
    date: 'August 20, 2026',
    recommendation:
      'I am pleased to recommend Sijomon, my student who has consistently demonstrated a positive attitude, sincerity, and a strong sense of responsibility. He has shown commendable initiative and leadership in academic and co-curricular activities. In particular, his involvement in organizing the “Idea to Patent” programme under the IPR Cell and the PG Department of Computer Applications reflects his ability to take responsibility, coordinate effectively, and work with commitment towards achieving a common objective. His enthusiasm, organizational skills, and willingness to take initiative are noteworthy. I am confident that Sijomon will continue to demonstrate these qualities and excel in his future academic and professional endeavours.',
    previewText:
      'I am pleased to recommend Sijomon, my student who has consistently demonstrated a positive attitude, sincerity, and a strong sense of responsibility. He has shown commendable initiative and leadership in academic and co-curricular activities.',
    fullText:
      'I am pleased to recommend Sijomon, my student who has consistently demonstrated a positive attitude, sincerity, and a strong sense of responsibility. He has shown commendable initiative and leadership in academic and co-curricular activities. In particular, his involvement in organizing the “Idea to Patent” programme under the IPR Cell and the PG Department of Computer Applications reflects his ability to take responsibility, coordinate effectively, and work with commitment towards achieving a common objective. His enthusiasm, organizational skills, and willingness to take initiative are noteworthy. I am confident that Sijomon will continue to demonstrate these qualities and excel in his future academic and professional endeavours.',
    avatar: '/recommendations/kochumol-abraham.webp',
  },
]
