export type Highlight = {
  id: string
  image: string
  name: string
  title?: string
  category?: string
  year?: string
  description?: string
  featured?: boolean
}

/**
 * Extracts the exact display name from a file path by removing directory and file extension.
 * Preserves exact casing, spacing, and characters without manual invention.
 */
export function getDisplayNameFromFilename(filePath: string): string {
  const filename = filePath.split('/').pop() || filePath
  const decoded = decodeURIComponent(filename)
  const lastDotIndex = decoded.lastIndexOf('.')
  if (lastDotIndex > 0) {
    return decoded.substring(0, lastDotIndex)
  }
  return decoded
}

// All 41 valid optimized highlight image assets discovered in public/higlight/
const highlightImagePaths: string[] = [
  '/higlight/Achivment.webp',
  '/higlight/After effects Editing.webp',
  '/higlight/Appriciation for Developing Website for College.webp',
  '/higlight/Bcom Friends.webp',
  '/higlight/Bcom Outstanding Student.webp',
  '/higlight/Chess Competition.webp',
  '/higlight/Conducting Workshop on Github.webp',
  '/higlight/Conducting Workshop on Github_.webp',
  '/higlight/Conducting Workshop on_Github.webp',
  '/higlight/Drawing for a Teacher.jpeg',
  '/higlight/Drawing for a Teacher.webp',
  '/higlight/Drawing for a Teacher_.webp',
  '/higlight/Drawing.webp',
  '/higlight/Editing.webp',
  '/higlight/Freelance Portrait Drawings .webp',
  '/higlight/Graduation.jpeg',
  '/higlight/Graduation.webp',
  '/higlight/Graduation_.webp',
  '/higlight/MCA 3rd Rank.webp',
  '/higlight/MCA Best Class Award.webp',
  '/higlight/MCA Best Class.webp',
  '/higlight/MCA Friends.webp',
  '/higlight/My Editig Got Millions of views.webp',
  '/higlight/NASA Space Apps Challenge.webp',
  '/higlight/Portrait Freelance.webp',
  '/higlight/Presentation.webp',
  '/higlight/Prices.webp',
  '/higlight/Project Presentation.webp',
  '/higlight/Sahya Core Team.webp',
  '/higlight/Sahya Core team.jpeg',
  '/higlight/TedxKcmt Team.webp',
  '/higlight/TedxKcmt friends.webp',
  '/higlight/TedxKcmt.webp',
  '/higlight/TedxKcmt_.webp',
  '/higlight/Took a Class for Computer Science Students .webp',
  '/higlight/Went to take Promotion Video For DC College.webp',
  '/higlight/With Baby Jean.webp',
  '/higlight/With Gokul Bijuraj.webp',
  '/higlight/With Riya Shibu.webp',
  '/higlight/Workshop on Github.webp',
  '/higlight/friends MCA.webp',
]

export const highlights: Highlight[] = highlightImagePaths.map((imagePath, index) => {
  const name = getDisplayNameFromFilename(imagePath)
  return {
    id: `highlight-${String(index + 1).padStart(2, '0')}`,
    image: imagePath,
    name,
    title: name,
  }
})
