// Type definition for project details
export type ProjectDetail = {
  id: number                // Unique identifier for the project
  title: string            // Project title
  company: string          // Company name
  overview: string         // Brief project overview
  mainImage: string        // Main project image path
  link: string            // Live project URL
  github?: string         // Optional GitHub repository URL
  features: {             // List of project features
    title: string         // Feature title
    description: string   // Feature description  
    image: string | string[] // Feature image(s) path
  }[]
  techStack: {            // Technical stack groupings
    category: string      // Tech category name
    items: string[]       // List of technologies
  }[]
  achievements: {         // Quantifiable achievements
    metric: string        // Achievement metric name
    value: string         // Achievement value
    change: number        // Numerical change/improvement
  }[]
}

// Project data mapping object
export const PROJECT_DATA: Record<number, ProjectDetail> = {
  1: {
    id: 1,
    title: "Example Project 1",
    company: "Example Company 1", 
    overview: "Project 1 Overview",
    mainImage: "/example1/main.png",
    link: "https://example1.com",
    features: [
      {
        title: "Feature 1",
        description: "Feature 1 Description",
        image: "/example1/feature1.png"
      }
    ],
    techStack: [
      {
        category: "Frontend",
        items: ["React", "TypeScript"]
      }
    ],
    achievements: [
      {
        metric: "Performance Improvement",
        value: "50%",
        change: 50
      }
    ]
  },
  2: {
    id: 2,
    title: "Example Project 2",
    company: "Example Company 2",
    overview: "Project 2 Overview", 
    mainImage: "/example2/main.png",
    link: "https://example2.com",
    features: [
      {
        title: "Feature 1",
        description: "Feature 1 Description",
        image: "/example2/feature1.png"
      }
    ],
    techStack: [
      {
        category: "Backend",
        items: ["Node.js", "Express"]
      }
    ],
    achievements: [
      {
        metric: "User Satisfaction",
        value: "95%",
        change: 95
      }
    ]
  }
}

// Helper function: Get project by ID
export const getProjectById = (id: number): ProjectDetail | undefined => {
  if (!Object.keys(PROJECT_DATA).length) {
    console.warn('PROJECT_DATA is empty');
    return undefined;
  }
  return PROJECT_DATA[id] || Object.values(PROJECT_DATA)[0];
}