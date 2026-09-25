export type Project = {
  id: string
  number: string
  title: string
  category: string
  description: string
  technologies: string[]
  image: string
  liveUrl: string
  githubUrl?: string
}

export const projects: Project[] = [
  {
    id: 'marian-research',
    number: '01',
    title: 'MarianResearch',
    category: 'WEB APPLICATION',
    description:
      'Full-stack institutional research management platform streamlining paper submission, review, approval, and administration for 100+ faculty and scholars.',
    technologies: ['Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Docker'],
    image: '/projects/marianresearch.webp',
    liveUrl: 'https://research.mariancollege.org/',
  },
  {
    id: 'zelenz',
    number: '02',
    title: 'ZELENZ',
    category: 'FREELANCE',
    description:
      'Modern corporate business website engineered with responsive architecture and clean interface design for a client.',
    technologies: ['Next.js', 'Tailwind CSS'],
    image: '/projects/zelenz.webp',
    liveUrl: 'https://www.zelenz.in/',
  },
  {
    id: 'chezmoi',
    number: '03',
    title: 'CHEZ MOI',
    category: 'FREELANCE',
    description:
      'Boutique commercial brand website designed and developed for a small business client with clean aesthetics.',
    technologies: ['Next.js', 'Tailwind CSS'],
    image: '/projects/chezmoi.webp',
    liveUrl: 'https://chezmoi-livid.vercel.app/',
  },
  {
    id: 'mark-gpt',
    number: '04',
    title: 'MARKGPT',
    category: 'CHROME EXTENSION',
    description:
      'Chrome extension that helps 120+ users bookmark and organize important conversations across ChatGPT, Claude, and Gemini.',
    technologies: ['JavaScript', 'Chrome API', 'HTML5', 'CSS3'],
    image: '/projects/markgpt.webp',
    liveUrl: 'https://chromewebstore.google.com/detail/eimdlmdbonaemjmfnnnknjejlijpmcij?utm_source=item-share-cb',
    githubUrl: 'https://github.com/sijomonps/MarkGPT',
  },
  {
    id: 'hp-crafts',
    number: '05',
    title: 'HP CRAFTS',
    category: 'FREELANCE',
    description:
      'First freelance business website built for a friend who sells handmade crafts, featuring responsive product showcases.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    image: '/projects/hpcrafts.webp',
    liveUrl: 'https://hpcrafts.in/',
    githubUrl: 'https://github.com/sijomonps/HpCrafts',
  },
  {
    id: 'tedx-kcmt',
    number: '06',
    title: 'TEDxKCMT',
    category: 'EVENT WEBSITE',
    description:
      'Official TEDx event landing website built to communicate event details and streamline attendee ticket registrations.',
    technologies: ['HTML5', 'CSS3'],
    image: '/projects/tedxkcmt.webp',
    liveUrl: 'https://sijomonps.github.io/Tedxkcmt/',
    githubUrl: 'https://github.com/sijomonps/Tedxkcmt',
  },
  {
    id: 'farewell-seniors',
    number: '07',
    title: 'FAREWELL',
    category: 'WEB APPLICATION',
    description:
      'Interactive farewell voting application with real-time poll results and live data synchronization using Firebase.',
    technologies: ['JavaScript', 'Firebase', 'HTML5', 'CSS3'],
    image: '/projects/farewell.webp',
    liveUrl: 'https://sijomonps.github.io/FareWell-Seniors/',
    githubUrl: 'https://github.com/sijomonps/FareWell-Seniors',
  },
  {
    id: 'flappy-aljo',
    number: '08',
    title: 'FLAPPY ALJO',
    category: 'WEB GAME',
    description:
      'Competitive browser arcade game engineered with custom audio, smooth physics, and real-time cloud leaderboards.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Firebase'],
    image: '/projects/flappy-aljo.webp',
    liveUrl: 'https://sijomonps.github.io/My-Flappy-Aljo/',
    githubUrl: 'https://github.com/sijomonps/My-Flappy-Aljo',
  },
]
