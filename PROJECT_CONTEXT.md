# Complete Technical Architecture & Codebase Analysis: Sijomon P S Portfolio

> **Document Purpose**: This comprehensive reference document provides an exhaustive, verified analysis of the portfolio codebase (`sijomonps.github.io`). It is designed for engineers and AI assistants to fully understand the project architecture, data flows, styling patterns, dependencies, and constraints before making any modifications.

---

## 1. PROJECT OVERVIEW

| Attribute | Specification / Verification |
| :--- | :--- |
| **Project Name** | `my-portfolio` (defined in [`package.json`](file:///home/sijomonps/Code/sijomonps.github.io/package.json#L2)) |
| **Owner / Subject** | Sijomon P S, Full-Stack Developer based in Thiruvalla, Kerala, India |
| **Portfolio Purpose** | Showcase personal profile, full-stack & DevOps technical skills, educational milestones, major certifications & hackathons, featured client/freelance projects, and professional contact links. |
| **Framework & Version** | **Next.js 16.2.2** (App Router architecture with static export) |
| **React Version** | **React 19.2.4** / React DOM 19.2.4 |
| **Language** | **TypeScript 5.7.2** (`strict: true`) |
| **Package Manager** | `npm` (lockfile version 3 via [`package-lock.json`](file:///home/sijomonps/Code/sijomonps.github.io/package-lock.json)) |
| **UI / Styling** | **Tailwind CSS 3.4.17** with PostCSS 8.4.49 and Autoprefixer 10.4.20 |
| **Animation Libraries** | **Framer Motion 12.38.0** |
| **Icon Libraries** | **React Icons 5.6.0** (`react-icons/si`, `react-icons/fa6`, `react-icons/fi`, `react-icons/tb`, `react-icons/md`) |
| **Typography Setup** | Google Fonts via `next/font/google`: **Bebas Neue** (display headings) and **Plus Jakarta Sans** (body text) |
| **Backend / DB / APIs** | **None** in the Next.js app itself. Configured as a 100% static client-side single-page application (`output: 'export'`). |
| **Deployment Target** | **GitHub Pages** (`https://sijomonps.github.io/`) automated via GitHub Actions ([`.github/workflows/deploy.yml`](file:///home/sijomonps/Code/sijomonps.github.io/.github/workflows/deploy.yml)) |

### User Experience Walkthrough
From a visitor's perspective:
1. **Entry & Hero**: The visitor lands on a full-height dark luxury hero section featuring an ambient background image with cinematic gradient overlays, drifting technical keyword tags (e.g., *Next.js*, *Docker*, *AWS*, *CI/CD*), an oversized display name (**SIJOMON P S**), title, location badge, and instant CTA links to GitHub, LinkedIn, Email, and a downloadable PDF resume.
2. **Top Navigation**: A minimalist fixed top navigation bar with a backdrop blur displays links with a dynamic white sliding underline that highlights whichever section is currently scrolled into view.
3. **About**: Displays a circular avatar portrait, professional summary, artistic background, story of developing *MarianResearch*, and future career goals.
4. **Skills**: Categorized technical pills (Frontend, Backend, Databases, Cloud & Deployment) displaying technology icons from `react-icons`.
5. **Education**: A clean vertical timeline marking milestones from Secondary School up to Master of Computer Applications (MCA) at Marian College Kuttikkanam.
6. **Highlights (Experience)**: Three glassmorphic cards highlighting full-stack certification, NASA Space Apps Challenge participation, and TEDxKCMT core team contributions, backed by dynamic ambient blue/teal glowing orbs.
7. **Projects**: Interactive cards highlighting flagship works (*MarianResearch*, *MarkGPT* Chrome extension, *TEDxKCMT* event website, and *Flappy Aljo* browser game) with tags, impact badges, live links, and GitHub links, backed by dynamic ambient amber/rust glowing orbs.
8. **Contact & Socials**: A contact section with glassmorphic circular buttons connecting to Email, Phone, Thiruvalla Google Maps location, GitHub, LinkedIn, Instagram, and X.
9. **Floating Navigation Pill**: Anchored at the bottom of the screen, a pill shows the name of the next upcoming section with a bouncing chevron down button that automatically scrolls the viewport. On mobile viewports, an additional 3-dot trigger button opens an upward navigation sheet.

---

## 2. COMPLETE PROJECT STRUCTURE

```text
/home/sijomonps/Code/sijomonps.github.io
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD deployment workflow
├── .vscode/
│   └── settings.json               # VS Code CSS unknownAtRules lint suppression
├── app/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AnimatedText.tsx        # Framer Motion fade/scale/blur scroll-in wrapper
│   │   │   ├── FloatingElements.tsx    # Randomly drifting background tech keywords
│   │   │   ├── GradientBackground.tsx  # Dynamic ambient blurred colored orbs on viewport entry
│   │   │   ├── Navbar.tsx              # Sticky top navigation bar with tracking underline
│   │   │   └── SectionJumpToggle.tsx   # Fixed bottom "Next Section" button & mobile menu
│   │   ├── education/
│   │   │   └── CourseTimeline.tsx      # Vertical timeline component for academic history
│   │   └── sections/
│   │       ├── About.tsx               # About me section with avatar and narrative
│   │       ├── Contact.tsx             # Contact links & social media buttons
│   │       ├── Experience.tsx          # Certifications, hackathons, and event involvement
│   │       ├── Hero.tsx                # Hero section with headline and action bar
│   │       ├── HeroVideoBackground.tsx # Static poster image and vignette gradient overlay
│   │       ├── MySkills.tsx            # Categorized skills grid with icon pills
│   │       └── Projects.tsx            # Featured project cards and external links
│   ├── fonts/
│   │   ├── GeistMonoVF.woff            # [UNUSED] Orphaned Next.js starter font (67 KB)
│   │   └── GeistVF.woff                # [UNUSED] Orphaned Next.js starter font (65 KB)
│   ├── favicon.ico                     # Portfolio favicon
│   ├── globals.css                     # Tailwind directives, CSS variables, custom cursors
│   ├── layout.tsx                      # Root layout, Google fonts, metadata, Schema JSON-LD
│   ├── page.tsx                        # Main landing page combining all sections
│   ├── robots.ts                       # Static robots.txt generator
│   └── sitemap.ts                      # Static sitemap.xml generator
├── public/
│   ├── cursors/
│   │   ├── triangle-pointer-24.svg       # Active custom cursor (light/silver gradient)
│   │   └── triangle-pointer-24-black.svg # [UNUSED] Dark cursor variant
│   ├── hero/
│   │   ├── hero-poster.webp              # Active hero background poster image (26 KB)
│   │   └── hero-video.mp4                # [UNUSED] High-res video file (2.5 MB)
│   ├── avatar.jpg                      # Profile picture of Sijomon P S (143 KB)
│   ├── github.svg                      # GitHub brand icon SVG for Hero action bar
│   ├── google5052dfb9b7c09393.html     # Google Search Console HTML verification file
│   ├── linkedin.svg                    # LinkedIn brand icon SVG for Hero action bar
│   ├── mail.svg                        # Mail icon SVG for Hero action bar
│   ├── Resume.pdf                      # Downloadable PDF resume (118 KB)
│   └── resume.svg                      # Document icon SVG for Hero action bar
├── .gitignore                          # Standard Next.js gitignore
├── eslint.config.mjs                   # ESLint 9 flat configuration with next-vitals
├── hlp.md                              # Internal cheat-sheet with npm scripts
├── LICENSE                             # MIT license file
├── next.config.ts                      # Next.js export and static image configuration
├── next-env.d.ts                       # Next.js TypeScript declaration file
├── package.json                        # Dependencies, engines, and run scripts
├── package-lock.json                   # Dependency lockfile
├── postcss.config.mjs                  # PostCSS plugins (tailwindcss, autoprefixer)
├── README.md                           # Project readme documentation
├── tailwind.config.ts                  # Tailwind configuration (dark mode, colors, fonts)
└── tsconfig.json                       # TypeScript compiler options and path aliases
```

### Folder Roles & Inter-File Relationships

* [`app/`](file:///home/sijomonps/Code/sijomonps.github.io/app): Contains the Next.js App Router core.
  * [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx) serves as the top-level Server Component wrapping all pages. It initializes Google Fonts, injects global Schema.org structured data, mounts the viewport and SEO metadata, and locks the `dark` theme on `<html>`.
  * [`app/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/page.tsx) is the sole page route (`/`), marked as a Client Component (`'use client'`). It imports and orchestrates the top navigation, all six section components, the inline education section, and the bottom jump toggle.
  * [`app/components/common/`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common): Shared UI utilities used across multiple sections. [`AnimatedText.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/AnimatedText.tsx) is imported by almost every section to provide uniform scroll-triggered reveal animations. [`GradientBackground.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/GradientBackground.tsx) is imported by `Experience.tsx`, `Projects.tsx`, and `Contact.tsx` for ambient glowing colors.
  * [`app/components/sections/`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections): Standalone section components. Each encapsulates its own section heading, layout, and hardcoded data models.
  * [`app/components/education/`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education): Contains [`CourseTimeline.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education/CourseTimeline.tsx), which renders the timeline cards for the education section defined in `page.tsx`.
* [`public/`](file:///home/sijomonps/Code/sijomonps.github.io/public): Static assets directly copied to the build root during `next build`. Contains brand SVGs, resume document, avatar, custom cursors, and the Google verification file.

### Unused, Obsolete, and Dead Code Audit

| Item | Path | Type | Details & Safe Remediation Notes |
| :--- | :--- | :--- | :--- |
| **Hero Video** | [`public/hero/hero-video.mp4`](file:///home/sijomonps/Code/sijomonps.github.io/public/hero/hero-video.mp4) | Unused Asset | **2.5 MB** video file. The codebase was refactored in commit `1b75080` to remove the animated video background in favor of `hero-poster.webp`. The video is never referenced anywhere in code and inflates git repository and deployment bundle size. |
| **Starter Fonts** | [`app/fonts/GeistMonoVF.woff`](file:///home/sijomonps/Code/sijomonps.github.io/app/fonts/GeistMonoVF.woff) & [`app/fonts/GeistVF.woff`](file:///home/sijomonps/Code/sijomonps.github.io/app/fonts/GeistVF.woff) | Unused Assets | **132 KB** total. Orphaned boilerplate fonts from the initial Next.js project creation. Never imported or referenced (`app/layout.tsx` uses `next/font/google` for Bebas Neue and Plus Jakarta Sans). |
| **Black Cursor SVG** | [`public/cursors/triangle-pointer-24-black.svg`](file:///home/sijomonps/Code/sijomonps.github.io/public/cursors/triangle-pointer-24-black.svg) | Unused Asset | SVG cursor designed for light backgrounds. Never referenced because `app/globals.css` hardcodes the light cursor (`triangle-pointer-24.svg`). |
| **Unused Icon Imports** | [`app/components/sections/MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx#L13) | Dead Code / Lint Warning | `SiPython` and `MdDevices` are imported from `react-icons` but never placed in the `skillsByCategory` array. Triggers ESLint warnings. |
| **PostCSS Anonymous Export** | [`postcss.config.mjs`](file:///home/sijomonps/Code/sijomonps.github.io/postcss.config.mjs#L1) | Lint Warning | Triggers `import/no-anonymous-default-export` warning in ESLint 9. Should be assigned to a constant before export. |
| **Invalid Breakpoint Classes** | [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L40) | Dead CSS Classes | Classes `xs:text-6xl` and `xs:text-xs` are used in Hero heading and subheading, but no `xs` screen breakpoint is defined in `tailwind.config.ts`. Tailwind silently ignores them. |
| **MUI Reference in README** | [`README.md`](file:///home/sijomonps/Code/sijomonps.github.io/README.md#L16) | Obsolete Documentation | Lists "Material UI" under Tech Stack, but Material UI (`@mui/material`) is neither installed nor used anywhere in the codebase. |

---

## 3. NEXT.JS ARCHITECTURE

### Router Model
* **App Router**: Uses Next.js 16 App Router ([`app/`](file:///home/sijomonps/Code/sijomonps.github.io/app)). There is no `pages/` directory.

### Component Paradigm
* **Server Components**:
  * [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx) is a Server Component. It evaluates static metadata, injects Google Fonts, formats JSON-LD schemas, and renders the initial HTML structure.
  * [`app/sitemap.ts`](file:///home/sijomonps/Code/sijomonps.github.io/app/sitemap.ts) and [`app/robots.ts`](file:///home/sijomonps/Code/sijomonps.github.io/app/robots.ts) execute as build-time server scripts to generate static indexing files.
* **Client Components**:
  * [`app/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/page.tsx) and every component inside [`app/components/`](file:///home/sijomonps/Code/sijomonps.github.io/app/components) are marked with `'use client'`. This is required because they rely on browser lifecycle APIs (`window.scrollY`, `window.innerHeight`, `window.requestAnimationFrame`, `window.matchMedia`), DOM queries (`document.querySelectorAll`, `document.getElementById`), React state/effects (`useState`, `useEffect`, `useRef`), and Framer Motion viewport triggers.
* **Server Actions**: None.
* **API Routes / Route Handlers**: None.
* **Middleware**: None.
* **Special Files Present**:
  * `app/layout.tsx`: Root HTML shell and provider of fonts/metadata.
  * `app/page.tsx`: Single-page root view.
  * `app/favicon.ico`: Standard favicon.
  * `app/robots.ts`: Generates `robots.txt`.
  * `app/sitemap.ts`: Generates `sitemap.xml`.
  * Note: `loading.tsx`, `error.tsx`, and `not-found.tsx` are **not custom-defined**; Next.js falls back to its internal static 404 generation (compiled into `out/404.html`).

### Lifecycle & Rendering Pipeline
1. During `npm run build`, Next.js invokes the static export engine (`output: "export"` in [`next.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/next.config.ts#L6)).
2. `RootLayout` executes server-side, embedding the JSON-LD `<script>`, Google Font CSS variables, metadata `<meta>` tags, and an inline before-interactive `<Script>` that sets `window.history.scrollRestoration = "manual"` and scrolls to `(0, 0)`.
3. The page tree under `Home` is statically rendered to static HTML in `out/index.html`.
4. When loaded in the browser, React 19 hydrates the DOM. `Navbar` and `SectionJumpToggle` register scroll listeners, `FloatingElements` initializes drifting coordinates, and `IntersectionObserver` instances in `GradientBackground` begin listening for section visibility.

### Route Mapping

| Route | Primary File | Output Format | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | [`app/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/page.tsx) | `out/index.html` | Complete single-page portfolio |
| `/sitemap.xml` | [`app/sitemap.ts`](file:///home/sijomonps/Code/sijomonps.github.io/app/sitemap.ts) | `out/sitemap.xml` | XML search engine index map |
| `/robots.txt` | [`app/robots.ts`](file:///home/sijomonps/Code/sijomonps.github.io/app/robots.ts) | `out/robots.txt` | Search crawler instructions |

---

## 4. PAGE-BY-PAGE ANALYSIS

Since this portfolio is designed as an integrated single-page application (SPA), the entire interactive experience lives on `/` ([`app/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/page.tsx)).

### Route `/` (Home Page)
* **Purpose**: Complete presentation of Sijomon P S's profile, skills, education, experience/highlights, projects, and contact avenues.
* **Component Flow (Top to Bottom)**:
  1. `<Navbar />` (Sticky fixed top header)
  2. `<Hero />` (Section id `#home`)
  3. `<About />` (Section id `#about`)
  4. `<MySkills />` (Section id `#skills`)
  5. `<section id="education">` wrapping `<CourseTimeline />`
  6. `<Experience />` (Section id `#experience`)
  7. `<Projects />` (Section id `#projects`)
  8. `<Contact />` (Section id `#contact`)
  9. `<SectionJumpToggle />` (Fixed bottom viewport pill & mobile menu)
* **User Interactions**:
  * Clicking any link in `<Navbar />` smoothly scrolls the page to the target section with a `-60px` top offset.
  * Clicking the floating bottom pill in `<SectionJumpToggle />` scrolls to the next upcoming section in sequence (or returns to `#home` when at the bottom).
  * On mobile, clicking the 3-dot button in `<SectionJumpToggle />` reveals an upward modal menu allowing instant jumps to any section. Pressing `Escape` or tapping outside closes it.
  * External anchor links open GitHub repositories, LinkedIn profiles, live projects, Chrome Web Store, Google Maps, or trigger `mailto:`/`tel:` protocols.
* **Data Displayed**:
  * Hero title, location, quick bio, social links, phone, email, resume link.
  * About narrative, avatar, creative journey, project milestone (*MarianResearch*), career aspirations.
  * 25 technical skills arranged into 4 categories with icons.
  * 4 educational milestones (MCA, B.Com, Higher Secondary, Secondary).
  * 3 key certifications/hackathons/events.
  * 4 featured projects with categories, summaries, tech tags, and external links.
  * 7 contact and social links.
* **Responsive Behavior**:
  * Desktop (>= 1024px): 16 floating tech words in hero; full navbar row; 3-column highlights grid; 2-column project cards with featured 2-span card; bottom jump pill without 3-dot trigger.
  * Tablet (768px - 1023px): 10 floating tech words; 3-column highlights grid; 2-column projects; responsive text scaling.
  * Mobile (< 768px): 6 floating tech words; horizontally scrollable navbar; 1-column stacked highlights and projects; 3-dot menu trigger enabled on bottom jump pill.

---

## 5. COMPONENT ARCHITECTURE

### Component Hierarchy Map

```text
Home (app/page.tsx)
├── Navbar (app/components/common/Navbar.tsx)
├── Hero (app/components/sections/Hero.tsx)
│   ├── HeroVideoBackground (app/components/sections/HeroVideoBackground.tsx)
│   ├── FloatingElements (app/components/common/FloatingElements.tsx)
│   └── AnimatedText (app/components/common/AnimatedText.tsx)
├── About (app/components/sections/About.tsx)
│   └── AnimatedText
├── MySkills (app/components/sections/MySkills.tsx)
│   └── AnimatedText
├── [section#education] (app/page.tsx)
│   └── CourseTimeline (app/components/education/CourseTimeline.tsx)
│       └── AnimatedText
├── Experience (app/components/sections/Experience.tsx)
│   ├── GradientBackground (app/components/common/GradientBackground.tsx)
│   └── AnimatedText
├── Projects (app/components/sections/Projects.tsx)
│   ├── GradientBackground
│   └── AnimatedText
├── Contact (app/components/sections/Contact.tsx)
│   ├── GradientBackground
│   └── AnimatedText
└── SectionJumpToggle (app/components/common/SectionJumpToggle.tsx)
```

### Detailed Component Specifications

#### 1. `Navbar`
* **File Path**: [`app/components/common/Navbar.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/Navbar.tsx)
* **Purpose**: Fixed top navigation bar with active section tracking and dynamic sliding underline indicator.
* **Props**: None.
* **State**: `activeSection: string` (defaults to `"home"`).
* **Refs**: `underlineRef: HTMLDivElement` (moves and resizes the sliding indicator), `navRef: HTMLUListElement`.
* **Hooks**: `useState`, `useEffect`, `useRef`.
* **Events**: `window.scroll` listener to determine which `<section id>` intersects the viewport offset line; click event on `<a>` that calls `preventDefault()` and `window.scrollTo({ behavior: 'smooth' })`.
* **Dependencies**: React.

#### 2. `SectionJumpToggle`
* **File Path**: [`app/components/common/SectionJumpToggle.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/SectionJumpToggle.tsx)
* **Purpose**: Fixed bottom floating action button displaying the next section name, bouncing chevron down/up icon, and a mobile modal popup menu for rapid navigation.
* **Props**: None.
* **State**: `currentIndex: number`, `isAtBottom: boolean`, `isMenuOpen: boolean`.
* **Refs**: `menuRef: HTMLDivElement` (for click-outside detection).
* **Hooks**: `useState`, `useEffect`, `useRef`.
* **Events**: Throttled scroll listener via `window.requestAnimationFrame`, window resize listener, `pointerdown` listener for outside menu dismissal, `keydown` listener for `Escape` key dismissal.
* **Dependencies**: `react-icons/fi` (`FiChevronDown`, `FiChevronUp`, `FiMoreHorizontal`).

#### 3. `AnimatedText`
* **File Path**: [`app/components/common/AnimatedText.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/AnimatedText.tsx)
* **Purpose**: Generic Framer Motion wrapper that applies a 3D rotate, blur, scale, and opacity transition when elements enter the viewport.
* **Props**: `{ children: React.ReactNode, className?: string }`.
* **State / Hooks**: None.
* **Animation Config**:
  ```ts
  hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)", rotateX: 45 }
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", rotateX: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1], staggerChildren: 0.1 } }
  viewport: { once: false, margin: "-100px" }
  ```
* **Dependencies**: `framer-motion`.

#### 4. `FloatingElements`
* **File Path**: [`app/components/common/FloatingElements.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/FloatingElements.tsx)
* **Purpose**: Generates and animates floating tech keyword badges across screen borders in the Hero section.
* **Props**: None.
* **State**: `elements: FloatingItem[]`.
* **Internal Logic**: Shuffles `allTechWords` (26 technical terms), distributes words into 4 perimeter quadrants (avoiding the center), checks distance using Euclidean overlap rejection (`checkOverlap`), and renders child `<FloatingWord>` components with infinite back-and-forth Framer Motion drifts (25s–50s durations).
* **Dependencies**: `framer-motion`.

#### 5. `GradientBackground`
* **File Path**: [`app/components/common/GradientBackground.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/GradientBackground.tsx)
* **Purpose**: Mounts two fixed blurred glowing color orbs in opposite corners that fade in (`opacity: 0.3`) when the parent section enters the viewport.
* **Props**: `{ sectionId: string, gradientColors: { start: string, end: string } }`.
* **State**: `isVisible: boolean`.
* **Hooks**: `useEffect` instantiating native `IntersectionObserver` on `document.getElementById(sectionId)` with `threshold: 0.3`.
* **Dependencies**: React.

#### 6. `Hero`
* **File Path**: [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx)
* **Purpose**: Renders the landing screen with headline typography, social/resume CTA pill buttons, phone, email, and integrates video background and floating words.
* **Props**: None.
* **State**: `isReducedMotion: boolean`.
* **Hooks**: `useEffect` checking `window.matchMedia('(prefers-reduced-motion: reduce)')`.
* **Dependencies**: `next/image`, `AnimatedText`, `FloatingElements`, `HeroVideoBackground`.

#### 7. `HeroVideoBackground`
* **File Path**: [`app/components/sections/HeroVideoBackground.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/HeroVideoBackground.tsx)
* **Purpose**: Displays the hero background visuals using Next.js `<Image>` displaying `/hero/hero-poster.webp`, overlaying three CSS gradient layers for luxury vignette and section blending.
* **Props**: `{ assetPath: (path: string) => string }`.
* **Dependencies**: `next/image`.

#### 8. `About`
* **File Path**: [`app/components/sections/About.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/About.tsx)
* **Purpose**: Presents Sijomon's avatar, creative background, narrative about building the *MarianResearch* portal, and career objectives.
* **Props**: None.
* **Dependencies**: `next/image`, `AnimatedText`.

#### 9. `MySkills`
* **File Path**: [`app/components/sections/MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx)
* **Purpose**: Displays a 4-row category layout of technical competencies using rounded pill badges with brand icons.
* **Props**: None.
* **Dependencies**: `AnimatedText`, `react-icons/si`, `react-icons/fa6`, `react-icons/tb`, `react-icons/md`.

#### 10. `CourseTimeline`
* **File Path**: [`app/components/education/CourseTimeline.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education/CourseTimeline.tsx)
* **Purpose**: Renders vertical timeline cards for academic qualifications.
* **Props**: None.
* **Dependencies**: `AnimatedText`.

#### 11. `Experience`
* **File Path**: [`app/components/sections/Experience.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Experience.tsx)
* **Purpose**: Renders a 3-card grid for certifications, hackathons, and leadership involvement with deep blue/teal ambient gradient.
* **Props**: None.
* **Dependencies**: `AnimatedText`, `GradientBackground`.

#### 12. `Projects`
* **File Path**: [`app/components/sections/Projects.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Projects.tsx)
* **Purpose**: Highlights 4 key software projects with tag badges, impact metrics, summaries, external links, and amber/rust ambient gradient.
* **Props**: None.
* **Dependencies**: `AnimatedText`, `GradientBackground`, `react-icons/fi` (`FiArrowUpRight`).

#### 13. `Contact`
* **File Path**: [`app/components/sections/Contact.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Contact.tsx)
* **Purpose**: Displays mission statement and circular glassmorphic icon links for direct contact and social channels.
* **Props**: None.
* **Dependencies**: `AnimatedText`, `GradientBackground`, `react-icons/fi`, `react-icons/fa6`.

---

## 6. STYLING SYSTEM

### Architecture & Engine
* **Tailwind CSS (v3.4.17)**: Primary utility-first styling engine configured in [`tailwind.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/tailwind.config.ts).
* **Global CSS**: Defined in [`app/globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css) with base directives (`@tailwind base; @tailwind components; @tailwind utilities;`).
* **CSS Modules**: Not used in the project.
* **CSS Variables**:
  * `--background: #09090b` (Tailwind Zinc 950 deep black)
  * `--foreground: #f4f4f5` (Tailwind Zinc 100 near-white)
  * `--site-cursor: url('/cursors/triangle-pointer-24.svg')`
  * `--font-display`: Provided by Google Font `Bebas_Neue`
  * `--font-body`: Provided by Google Font `Plus_Jakarta_Sans`
* **Theme & Dark Mode**:
  * Configured via `darkMode: "class"` in `tailwind.config.ts`.
  * The root HTML tag in [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L175) is hardcoded to `<html lang="en" className="dark" data-theme="dark">`.
  * **There is no client theme switcher**. The entire site is locked to dark luxury mode.

### Typography
* **Display Font**: `Bebas_Neue` (loaded via `next/font/google` in `layout.tsx`). Applied to headings `h1, h2, h3, h4` and `.font-display` with uppercase tracking (`letter-spacing: 0.04em`).
* **Body Font**: `Plus_Jakarta_Sans` (loaded via `next/font/google` in `layout.tsx`). Applied to `body` and `font-sans` with `-0.01em` letter spacing.

### Custom Cursor
In [`app/globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css#L32-L48), on devices with fine pointer controls (`@media (pointer: fine)`):
* Elements `html, body, a, button, [role='button'], summary, label, select` receive `cursor: var(--site-cursor) 1 1, default;` referencing `/cursors/triangle-pointer-24.svg`.
* Text fields `input, textarea` retain standard `cursor: text`.

### Glassmorphism & Visual Aesthetics
* **Glassmorphism**: Extensively implemented using Tailwind classes `backdrop-blur-sm`, `backdrop-blur-md`, `backdrop-blur-xl` combined with translucent white fills (`bg-white/[0.02]`, `bg-white/[0.08]`, `bg-white/10`) and subtle white border strokes (`border-white/10`, `border-white/20`).
* **Scrollbar Suppression**: Hidden across WebKit browsers via `::-webkit-scrollbar { display: none; }` in `globals.css`.
* **Smooth Scrolling**: Enforced on the HTML root via `html { scroll-behavior: smooth; }`.

### Files Controlling Visual Design

| Modification Area | Primary Files |
| :--- | :--- |
| **Global Theme & Base Colors** | [`app/globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css) & [`tailwind.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/tailwind.config.ts) |
| **Typography & Web Fonts** | [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L6-L17) & [`tailwind.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/tailwind.config.ts#L17-L20) |
| **Custom Cursor** | [`app/globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css#L8) & [`public/cursors/`](file:///home/sijomonps/Code/sijomonps.github.io/public/cursors) |
| **Section Glow Colors** | [`app/components/common/GradientBackground.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/GradientBackground.tsx) & section files |
| **Section Layouts & Spacing** | Individual files in [`app/components/sections/`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections) and [`app/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/page.tsx) |

---

## 7. UI / UX ANALYSIS

### Section-by-Section Review

#### 1. Header / Navbar
* **Content**: 7 links: Home (`#home`), About (`#about`), Skills (`#skills`), Education (`#education`), Highlights (`#experience`), Projects (`#projects`), Contact (`#contact`).
* **Desktop**: Horizontally centered pill row with 32px (`gap-8`) gap. Active link underlined by animated 2px white indicator line.
* **Mobile**: Horizontally scrolling bar (`overflow-x-auto gap-4`).
* **UX Inconsistencies / Polish Opportunities**:
  * On narrow mobile viewports, the horizontal navbar requires manual side-scrolling, which can be awkward alongside the bottom jump toggle.
  * Underline position is computed from `getBoundingClientRect()`, which can be slightly inaccurate if the navbar itself is horizontally scrolled on mobile.

#### 2. Hero Section (`#home`)
* **Content**: Location badge ("Thiruvalla, Kerala, India"), giant headline ("SIJOMON P S"), subtitle ("Full-Stack Developer | Web • Cloud • DevOps"), editorial statement, social & resume pill buttons, phone and email meta info.
* **Desktop**: Full-height viewport layout (`min-h-screen`) with center alignment, floating tech badges around perimeter, and grounded bottom action bar.
* **Mobile**: Reduced headline scale (`text-5xl`), stacked action pills, floating badges reduced from 16 to 6 items to prevent visual crowding.

#### 3. About Section (`#about`)
* **Content**: Centered circular avatar photo (`avatar.jpg`), large title "ABOUT ME", followed by three subsections: *Creative Foundation*, *Development Journey* (*MarianResearch* narrative), and *Career Goals*.
* **Desktop**: Centered max-width column (`max-w-3xl`) with comfortable line height (`leading-relaxed`) and text sizes (`text-lg`).
* **Mobile**: Avatar and text scale down smoothly with vertical stacking.

#### 4. Skills Section (`#skills`)
* **Content**: Heading "TECHNICAL SKILLS" with 4 categorical cards (Frontend, Backend, Databases, Cloud & Deployment) containing 25 pill badges with icons.
* **Desktop**: Split card layout: category title takes 33% left width (`w-1/3`), badges wrap on the right (`flex-1`).
* **Mobile**: Category title stacks directly above badges.

#### 5. Education Section (`#education`)
* **Content**: Heading "EDUCATION" with 4 academic qualification cards connected by a vertical timeline line with bullet indicators.
* **Desktop**: Left vertical connector line with 34px offset bullet markers.
* **Mobile**: Scaled-down padding (`pl-8`) and smaller bullet nodes.

#### 6. Highlights / Certifications Section (`#experience`)
* **Content**: Heading "CERTIFICATIONS AND INVOLVEMENT", 3 highlight cards (NxtWave Full-Stack Certification, NASA Space Apps Hackathon, TEDxKCMT Core Team), and a bottom button linking to LinkedIn certificates.
* **Desktop**: 3-column equal grid (`md:grid-cols-3`).
* **Mobile**: Single-column vertical stack.
* **UX Inconsistency**: Label mismatch: The navbar and bottom jump pill call this section **"Highlights"**, the section container id is **`#experience`**, but the section's actual `h2` heading reads **"CERTIFICATIONS AND INVOLVEMENT"**.

#### 7. Projects Section (`#projects`)
* **Content**: Heading "FEATURED PROJECTS", intro paragraph, 4 project cards, and bottom button linking to GitHub repositories (30+).
* **Desktop**: 2-column grid (`md:grid-cols-2`). The featured project (*MarianResearch*) spans both columns with an amber border glow (`border-amber-400/50`).
* **Mobile**: Single-column vertical stack. All cards show tags, category, impact badge, live link, and GitHub link.

#### 8. Contact Section (`#contact`)
* **Content**: Heading "LET'S CONNECT", personal mission statement, and 7 circular glassmorphic icon buttons.
* **Desktop**: Horizontally centered flex row of circular icon buttons with hover scale/lift transitions.
* **Mobile**: Wrapped row constrained to `max-w-[13.5rem]` to form a tidy two-row icon cluster.

#### 9. Floating Navigation Pill (`SectionJumpToggle`)
* **Content**: Shows "Next: [Upcoming Section Name]" with bouncing down chevron (or up chevron at page bottom) and a 3-dot menu button on mobile.
* **Desktop**: Bottom center pill button. Clicking it smoothly advances to the next section.
* **Mobile**: 3-dot trigger button opens an upward navigation sheet listing all sections.

---

## 8. CONTENT / DATA MAP

All portfolio content is **statically compiled and stored in client-side TypeScript/TSX files**. There is no CMS, database, or external markdown/JSON loader.

| Content Item | Stored Location | Storage Pattern | Details / Edit Target |
| :--- | :--- | :--- | :--- |
| **Personal Name & Titles** | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L40) & [`layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L29) | Hardcoded JSX & Metadata object | Headline, title, OpenGraph tags, JSON-LD |
| **Location & Contact Details** | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L148), [`Contact.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Contact.tsx#L15), [`layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L111) | Hardcoded JSX & TS arrays | Phone (`+916235719647`), Email (`sijomon700@gmail.com`), Thiruvalla location |
| **Hero Pitch Text** | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L53) | Hardcoded JSX | "Building modern web applications for freelance clients..." |
| **Floating Tech Words** | [`FloatingElements.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/FloatingElements.tsx#L6) | Static TS string array `allTechWords` | 26 technology keywords |
| **About Bio & Narratives** | [`About.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/About.tsx#L30-L65) | Hardcoded JSX paragraphs and lists | Creative foundation, MarianResearch narrative, goals |
| **Technical Skills & Icons** | [`MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx#L33) | Static TS array `skillsByCategory` | Category names, skill names, and React Icon components |
| **Education History** | [`CourseTimeline.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education/CourseTimeline.tsx#L13) | Static TS array `educationTimeline` | Periods, degrees, institutions |
| **Highlights / Certifications** | [`Experience.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Experience.tsx#L12) | Static TS array `highlights` | Titles, organizations, dates, bullet points |
| **Projects Data** | [`Projects.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Projects.tsx#L19) | Static TS array `projects` | Titles, categories, summaries, stacks, live URLs, GitHub URLs |
| **Contact Links** | [`Contact.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Contact.tsx#L15) | Static TS array `contactItems` | Labels, URLs (`mailto:`, `tel:`, maps, social links), Icon components |
| **Top Navigation Items** | [`Navbar.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/Navbar.tsx#L5) | Static TS array `navItems` | Section names and `#anchor` hashes |
| **Bottom Navigation Items** | [`SectionJumpToggle.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/SectionJumpToggle.tsx#L11) | Static TS array `sections` | Section IDs and display names |
| **Resume Document** | [`public/Resume.pdf`](file:///home/sijomonps/Code/sijomonps.github.io/public/Resume.pdf) | Static PDF binary file | Linked from Hero section (`/Resume.pdf`) |
| **Profile Photo** | [`public/avatar.jpg`](file:///home/sijomonps/Code/sijomonps.github.io/public/avatar.jpg) | Static JPEG image | Displayed in About section and linked in JSON-LD |

---

## 9. ASSETS AUDIT

| Asset Path | Type | File Size | Dimensions | Used In | Status / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`public/avatar.jpg`](file:///home/sijomonps/Code/sijomonps.github.io/public/avatar.jpg) | JPEG | 143 KB | 959 x 960 | [`About.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/About.tsx#L18), [`layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L110) | **Active**. Profile portrait. Downscaled to 120x120 via CSS. |
| [`public/hero/hero-poster.webp`](file:///home/sijomonps/Code/sijomonps.github.io/public/hero/hero-poster.webp) | WebP | 26 KB | 1280 x 720 | [`HeroVideoBackground.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/HeroVideoBackground.tsx#L12), [`layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L64) | **Active**. Hero visual background and OpenGraph/Twitter social share image. |
| [`public/hero/hero-video.mp4`](file:///home/sijomonps/Code/sijomonps.github.io/public/hero/hero-video.mp4) | MP4 Video | **2.5 MB** | 1920 x 1080 | None | **DEAD / UNUSED**. Legacy video background, never referenced in code. Safe to remove. |
| [`public/Resume.pdf`](file:///home/sijomonps/Code/sijomonps.github.io/public/Resume.pdf) | PDF Document | 118 KB | N/A | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L12) | **Active**. Direct download link. Note: Case-sensitive path `/Resume.pdf`. |
| [`public/cursors/triangle-pointer-24.svg`](file:///home/sijomonps/Code/sijomonps.github.io/public/cursors/triangle-pointer-24.svg) | SVG Cursor | ~600 B | 24 x 24 | [`globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css#L8) | **Active**. Custom silver gradient pointer cursor. |
| [`public/cursors/triangle-pointer-24-black.svg`](file:///home/sijomonps/Code/sijomonps.github.io/public/cursors/triangle-pointer-24-black.svg) | SVG Cursor | ~600 B | 24 x 24 | None | **DEAD / UNUSED**. Dark cursor variant, not referenced. |
| [`public/github.svg`](file:///home/sijomonps/Code/sijomonps.github.io/public/github.svg) | SVG Icon | 504 B | Vector | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L75) | **Active**. GitHub icon in Hero action pill. |
| [`public/linkedin.svg`](file:///home/sijomonps/Code/sijomonps.github.io/public/linkedin.svg) | SVG Icon | 378 B | Vector | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L96) | **Active**. LinkedIn icon in Hero action pill. |
| [`public/mail.svg`](file:///home/sijomonps/Code/sijomonps.github.io/public/mail.svg) | SVG Icon | 316 B | Vector | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L116) | **Active**. Mail icon in Hero action pill. |
| [`public/resume.svg`](file:///home/sijomonps/Code/sijomonps.github.io/public/resume.svg) | SVG Icon | 785 B | Vector | [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L138) | **Active**. Document icon in Hero action pill. |
| [`public/google5052dfb9b7c09393.html`](file:///home/sijomonps/Code/sijomonps.github.io/public/google5052dfb9b7c09393.html) | HTML File | 53 B | N/A | Search Console | **Active**. Google Search Console ownership verification file. |
| [`app/favicon.ico`](file:///home/sijomonps/Code/sijomonps.github.io/app/favicon.ico) | ICO Icon | ~4 KB | Multi-res | [`layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L90) | **Active**. Browser tab icon. |
| [`app/fonts/GeistVF.woff`](file:///home/sijomonps/Code/sijomonps.github.io/app/fonts/GeistVF.woff) | WOFF Font | 65 KB | N/A | None | **DEAD / UNUSED**. Orphaned starter template font. |
| [`app/fonts/GeistMonoVF.woff`](file:///home/sijomonps/Code/sijomonps.github.io/app/fonts/GeistMonoVF.woff) | WOFF Font | 67 KB | N/A | None | **DEAD / UNUSED**. Orphaned starter template font. |

---

## 10. ANIMATIONS AND INTERACTIONS

### 1. Viewport-Triggered 3D Reveals (`AnimatedText.tsx`)
* **Technology**: Framer Motion (`motion.div`).
* **Variants**: Starts with `opacity: 0`, `scale: 0.9`, `filter: blur(10px)`, `rotateX: 45deg`. Transitions to `opacity: 1`, `scale: 1`, `filter: blur(0px)`, `rotateX: 0deg` over 0.8s using cubic-bezier easing `[0.25, 0.1, 0.25, 1]`.
* **Viewport Policy**: Configured with `viewport={{ once: false, margin: "-100px" }}`.
* **Performance Note**: Because `once: false` is used, scrolling up and down repeatedly triggers blur and 3D rotations on all cards, which can cause frame drops on lower-powered devices.

### 2. Drifting Technical Badges (`FloatingElements.tsx`)
* **Technology**: Framer Motion.
* **Behavior**: Renders 6 to 16 keywords with slight rotations (-15° to +15°) and low opacity (0.30–0.45) that drift along X and Y axes in continuous infinite loops (25s–50s per cycle).
* **Accessibility**: Respects `prefers-reduced-motion` in `Hero.tsx` by unmounting when enabled.

### 3. Ambient Dynamic Gradient Orbs (`GradientBackground.tsx`)
* **Technology**: Native `IntersectionObserver` + CSS `linear-gradient` with `blur(80px)`.
* **Behavior**: Two large circular orbs fixed in opposite screen corners fade from `opacity: 0` to `opacity: 0.3` over 0.8s when the designated section reaches 30% viewport visibility.
  * Experience Section: Dark Blue (`#1E3A8A`) to Dark Cyan (`#0F766E`)
  * Projects Section: Amber 700 (`#B45309`) to Amber 900 (`#7C2D12`)
  * Contact Section: Dark Cyan (`#0F766E`) to Cyan 800 (`#155E75`)

### 4. Sliding Navigation Underline (`Navbar.tsx`)
* **Technology**: Native DOM refs + inline CSS style manipulation.
* **Behavior**: Evaluates `getBoundingClientRect()` on the active anchor link and updates `underlineRef.current.style.left` and `width` with a 300ms ease-out transition.

### 5. Floating Bottom Navigation & Upward Sheet (`SectionJumpToggle.tsx`)
* **Technology**: React state + CSS transitions + Framer/Tailwind animation.
* **Behavior**: Bouncing chevron icon (`animate-bounce`) points down, switches to up when scrolled to bottom. The mobile 3-dot trigger button smoothly toggles an upward-opening glassmorphic menu.

---

## 11. FORMS & CONTACT SYSTEM

* **Form Fields / Submission Logic**: **There is NO contact form**.
* **Architecture**: The contact system relies entirely on direct protocol handlers and outbound profile links in [`app/components/sections/Contact.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Contact.tsx):
  1. `Email`: `mailto:sijomon700@gmail.com`
  2. `Phone`: `tel:+916235719647`
  3. `Location`: `https://maps.google.com/?q=Thiruvalla,+Kerala,+India`
  4. `GitHub`: `https://github.com/sijomonps`
  5. `LinkedIn`: `https://www.linkedin.com/in/sijomonps/`
  6. `Instagram`: `https://www.instagram.com/zeejo.ae/`
  7. `X`: `https://x.com/sijomonps`
* **Backend / API / Email Services**: None used.
* **Security & Environment Variables**: No secret tokens, API keys, or spam tokens are required or exposed. All external links use `rel="noopener noreferrer"` and `target="_blank"`.

---

## 12. SEO & METADATA ANALYSIS

### Implemented SEO Features
* **Metadata Base**: `https://sijomonps.github.io` configured in [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx#L27).
* **Title & Template**: Default: `"Sijomon P S — Full-Stack Developer in Kerala"`, Template: `"%s | Sijomon P S"`.
* **Description & Keywords**: Targeted keywords covering full-stack development, Next.js, React, Python, Cloud, and Kerala/Thiruvalla location queries.
* **Canonical URL**: Alternates canonical set to `/` (resolves to `https://sijomonps.github.io/`).
* **OpenGraph**: Configured for `website` type with title, description, and high-resolution banner image (`/hero/hero-poster.webp`, 1280x720).
* **Twitter Card**: `summary_large_image` referencing `/hero/hero-poster.webp`.
* **Robots Configuration**:
  * Set via metadata in `layout.tsx` (`index: true, follow: true` with GoogleBot directives).
  * Generated programmatically via [`app/robots.ts`](file:///home/sijomonps/Code/sijomonps.github.io/app/robots.ts) exporting static `out/robots.txt`.
* **Sitemap Generation**: Programmatically generated via [`app/sitemap.ts`](file:///home/sijomonps/Code/sijomonps.github.io/app/sitemap.ts) exporting static `out/sitemap.xml`.
* **Structured Data (Schema.org JSON-LD)**: Injected directly into `<head>` in `app/layout.tsx`:
  * `@type: "Person"` with name, jobTitle, address (Thiruvalla, Kerala, IN), email, phone, sameAs links, and `knowsAbout` skills list.
  * `@type: "WebSite"` with site name and publisher link.
  * `@type: "ProfilePage"` linking to the Person entity.
* **Google Verification**: Both a meta verification tag in `layout.tsx` (`TtdBbPpWogDiMgSiuz6zjh3gKCrhS_Ec_p8urZ-ZziM`) and an HTML file in `public/google5052dfb9b7c09393.html`.

### Missing SEO Items
* **Twitter Handle**: Neither `creator` (`@sijomonps`) nor `site` handle is specified in the Twitter metadata block in `layout.tsx`.

---

## 13. PERFORMANCE AUDIT

| Performance Vector | Current State | Potential Bottleneck / Assessment |
| :--- | :--- | :--- |
| **Static HTML Export** | `output: "export"` | **Excellent**. Delivers raw pre-rendered HTML and static assets via GitHub Pages CDN with zero server runtime latency. |
| **Unoptimized Images** | `images: { unoptimized: true }` | **Moderate Risk**. Necessary for GitHub Pages, but means Next.js does not resize or convert images. `avatar.jpg` (960x959, 143 KB) is loaded in full resolution to render a 120x120 circle. Manually creating a 240x240 WebP avatar would reduce size by ~85%. |
| **Dead Bundle Weight** | 2.5 MB unused MP4 | `public/hero/hero-video.mp4` is deployed to GitHub Pages and cached, consuming bandwidth and storage despite being completely unused in code. |
| **Framer Motion Re-renders** | `AnimatedText.tsx` with `once: false` | Re-triggers CSS blur and 3D matrix transforms on scroll. On mobile devices with integrated GPUs, this can cause frame pacing stutter. Changing `once: false` to `once: true` eliminates redundant recalculations. |
| **Client Component Footprint** | All section components are `'use client'` | Since the site is statically exported, all client JS is bundled and hydrated. The total bundle is lightweight (~180 KB compressed), but client hydration overhead could be reduced by converting purely presentation wrappers (like `About` or `HeroVideoBackground`) to Server Components. |
| **Font Delivery** | `next/font/google` | **Optimized**. Bebas Neue and Plus Jakarta Sans are preloaded and inlined at build time with `display: 'swap'`. |

---

## 14. ACCESSIBILITY (A11Y)

* **Semantic Hierarchy**: Uses `<header>`, `<nav>`, `<main>`, `<section>`, and `<article>`. Headings follow a logical structure: `<h1>` (Name) -> `<h2>` (Section headings) -> `<h3>` (Card titles).
* **Screen Reader Attributes**:
  * `<nav aria-label="Main Navigation">` on the top navbar.
  * Explicit `aria-label` tags on all navbar links, bottom jump buttons, and social icon buttons.
  * Decorative background image in `HeroVideoBackground.tsx` correctly flagged with `alt=""` and `aria-hidden="true"`.
  * Decorative icons in `Contact.tsx` flagged with `aria-hidden="true"`.
* **Reduced Motion Compliance**:
  * `Hero.tsx` checks `prefers-reduced-motion: reduce` and conditionally disables `FloatingElements`.
  * *Gap*: `AnimatedText.tsx` does **not** check `prefers-reduced-motion`; blur/rotate transitions still run.
* **Custom Cursor A11y**:
  * The custom SVG cursor is applied under `@media (pointer: fine)`, preserving native touch interactions on mobile. However, hiding the default OS pointer on desktop can cause tracking fatigue for some users.
* **Color Contrast**:
  * Most text uses `text-foreground` (`#f4f4f5`) on `#09090b` (high contrast ~18:1).
  * *Potential issue*: Dim text utilities like `text-foreground/50` or `text-[10px] text-foreground/55` may fail WCAG AA contrast minimums (4.5:1) in brightly lit environments.

---

## 15. RESPONSIVE DESIGN

* **Breakpoints**: Standard Tailwind breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`).
* **Layout Adaptations**:
  * `Navbar`: Flips from a centered desktop row (`gap-8`) to a horizontally scrollable container on mobile (`overflow-x-auto gap-4`).
  * `Hero`: Font sizes scale down from `text-9xl` to `text-5xl`. Action buttons wrap. Floating words reduce from 16 to 6.
  * `Highlights (Experience)`: 3-column desktop grid collapses to a 1-column mobile stack.
  * `Projects`: 2-column desktop grid collapses to a 1-column mobile stack.
  * `Contact`: Buttons flex-wrap with a max-width constrainer on mobile to form a tidy two-row icon cluster.
* **Safe Area Support**:
  * Fixed bottom elements in `Hero.tsx` and `SectionJumpToggle.tsx` use `env(safe-area-inset-bottom)`:
    `style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}`.
    This guarantees that on iOS Safari and modern Android devices, the bottom navigation toggle does not collide with the OS home indicator bar.

---

## 16. DEPENDENCIES AUDIT

| Package | Version | Purpose | Usage In Codebase | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`next`** | `^16.2.2` | Core React Framework | App Router, static export, fonts, metadata | Next.js 16 |
| **`react`** | `^19.2.4` | UI Library | Component rendering, hooks | React 19 |
| **`react-dom`** | `^19.2.4` | DOM Renderer | React hydration and DOM reconciliation | React DOM 19 |
| **`framer-motion`** | `^12.38.0` | Animation Engine | `AnimatedText.tsx`, `FloatingElements.tsx` | Compatible with React 19 |
| **`react-icons`** | `^5.6.0` | SVG Icons | `MySkills.tsx`, `Contact.tsx`, `Projects.tsx`, `SectionJumpToggle.tsx` | Tree-shaken at build time |
| **`tailwindcss`** | `^3.4.17` | Utility CSS Framework | Styling across all components | Dev dependency |
| **`postcss`** | `^8.4.49` | CSS Post-processor | Compiles Tailwind directives | Dev dependency |
| **`autoprefixer`** | `^10.4.20` | CSS Vendor Prefixing | Adds browser vendor prefixes | Dev dependency |
| **`typescript`** | `^5` (5.7.2) | Type Safety | Type checking and compilation | Dev dependency |
| **`eslint`** | `^9.39.4` | Linter | Code quality analysis | ESLint 9 Flat Config |
| **`eslint-config-next`** | `^16.2.2` | Next.js ESLint Rules | Next.js core web vitals & TS rules | Matches Next.js version |

---

## 17. CONFIGURATION FILES

* [`package.json`](file:///home/sijomonps/Code/sijomonps.github.io/package.json): Defines dependencies, private flag, and engines (`"node": ">=20.9.0"`).
* [`next.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/next.config.ts):
  * `output: "export"`: Compiles the application into static HTML/CSS/JS in `./out`.
  * `images.unoptimized: true`: Disables server-side image optimization to allow pure static file serving on GitHub Pages.
  * `trailingSlash: true` when in production to ensure proper path routing on GitHub Pages.
* [`tsconfig.json`](file:///home/sijomonps/Code/sijomonps.github.io/tsconfig.json): Configured with `target: "ES2017"`, `moduleResolution: "bundler"`, `strict: true`, and path alias `"@/*": ["./*"]`.
* [`tailwind.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/tailwind.config.ts): Enables class-based dark mode (`darkMode: "class"`), scans `./app/**/*.{js,ts,jsx,tsx}`, and maps CSS variables for `background`, `foreground`, `fontFamily.display`, and `fontFamily.sans`.
* [`eslint.config.mjs`](file:///home/sijomonps/Code/sijomonps.github.io/eslint.config.mjs): ESLint 9 flat configuration extending `nextVitals` and `nextTypeScript`, ignoring `.next/**`, `out/**`, `build/**`, and `next-env.d.ts`.
* [`.vscode/settings.json`](file:///home/sijomonps/Code/sijomonps.github.io/.vscode/settings.json): Suppresses unknown CSS at-rule warnings (`@tailwind`) in VS Code.
* [`.github/workflows/deploy.yml`](file:///home/sijomonps/Code/sijomonps.github.io/.github/workflows/deploy.yml): Automates checkout, Node 20 setup, npm dependency caching, `next build`, and deployment of `./out` to GitHub Pages upon pushes to branch `main`.

---

## 18. DATA FLOW

```text
Static Code & Assets (app/components/*, public/*)
       ↓
Next.js Static Compilation (`next build` with `output: 'export'`)
       ↓
Static Output Directory (`./out/`)
  ├── index.html (Pre-rendered DOM with JSON-LD Schema & Inlined Google Fonts)
  ├── sitemap.xml & robots.txt
  └── Static Assets (images, SVGs, PDF, CSS, JS chunks)
       ↓
GitHub Pages CDN Deployment (via .github/workflows/deploy.yml)
       ↓
Client Browser Loads index.html
       ↓
React 19 Hydration (`page.tsx` & Client Components mount)
       ↓
Runtime Client Subsystems:
  ├── Navbar: window.scroll → activeSection state → underlineRef DOM transform
  ├── SectionJumpToggle: rAF scroll listener → nextSection calculation → bottom pill
  ├── IntersectionObserver: detects section in-view → toggles GradientBackground opacity
  └── Framer Motion: triggers FloatingElements drift & AnimatedText 3D scroll reveals
```

---

## 19. DEPLOYMENT PIPELINE

* **Platform**: GitHub Pages (`https://sijomonps.github.io/`).
* **Trigger**: Automatic on every push to the `main` branch or manual `workflow_dispatch`.
* **Workflow File**: [`.github/workflows/deploy.yml`](file:///home/sijomonps/Code/sijomonps.github.io/.github/workflows/deploy.yml).
* **Pipeline Steps**:
  1. `actions/checkout@v4`: Clones repository.
  2. Detects package manager (`npm ci` via `package-lock.json`).
  3. `actions/setup-node@v4`: Installs Node.js 20 with npm caching.
  4. `actions/configure-pages@v5`: Configures Pages runtime metadata.
  5. `actions/cache@v4`: Caches `.next/cache` between runs for accelerated builds.
  6. `next build`: Generates the static export in `./out`.
  7. `actions/upload-pages-artifact@v3`: Packages `./out`.
  8. `actions/deploy-pages@v4`: Publishes artifact to GitHub Pages.
* **Required GitHub Settings**: Under Repository Settings > Pages > Build and deployment > Source, select **GitHub Actions**.

---

## 20. CODE QUALITY EVALUATION

### Things That Are Already Well Structured
1. **Strong SEO & Schema Implementation**: Clean JSON-LD graph in `layout.tsx` mapping Person, WebSite, and ProfilePage entities; fully specified OpenGraph and Twitter cards; automated static sitemap and robots.txt.
2. **Modern Toolchain**: Next.js 16, React 19, Tailwind CSS, TypeScript strict mode, and ESLint 9.
3. **Flawless Automated CI/CD**: Zero-maintenance deployment pipeline with dependency caching and build verification.
4. **Mobile Polish**: Thoughtful touch UX with safe-area insets, an upward-opening navigation sheet on mobile, and reduced motion fallbacks for animated particles.

### Obvious Issues
1. **Unused Imports**: In [`MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx#L13), `SiPython` and `MdDevices` are imported but never rendered, generating ESLint warnings.
2. **PostCSS Warning**: Anonymous default export in [`postcss.config.mjs`](file:///home/sijomonps/Code/sijomonps.github.io/postcss.config.mjs#L1).
3. **Dead Asset Bloat**: [`public/hero/hero-video.mp4`](file:///home/sijomonps/Code/sijomonps.github.io/public/hero/hero-video.mp4) (2.5 MB) is unused. [`app/fonts/`](file:///home/sijomonps/Code/sijomonps.github.io/app/fonts) contains 132 KB of unused WOFF files.
4. **Invalid Tailwind Classes**: `xs:text-6xl` and `xs:text-xs` in [`Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx#L40) rely on an unconfigured `xs` breakpoint.

### Possible Issues / Architectural Polish
1. **Data Decentralization**: Portfolio data (bio, skills, jobs, projects, contact info) is hardcoded inside individual TSX files rather than imported from a single data module.
2. **Section Terminology Discrepancy**: Section `#experience` is titled "CERTIFICATIONS AND INVOLVEMENT" in `Experience.tsx`, but labeled "Highlights" in both `Navbar.tsx` and `SectionJumpToggle.tsx`.
3. **Component Placement Inconsistency**: Unlike all other sections, the education section's outer `<section id="education">` and `<h2>` are declared in `app/page.tsx`, while its inner cards live in `app/components/education/CourseTimeline.tsx`.
4. **Scroll Offset Inconsistency**: `Navbar.tsx` offsets scroll by 60px (`NAVBAR_HEIGHT = 60`), whereas `SectionJumpToggle.tsx` offsets by 68px (`NAVBAR_OFFSET = 68`).
5. **Empty Highlight Arrays**: In [`Projects.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Projects.tsx#L26), the `highlights: []` array on every project is empty.

---

## 21. MODIFICATION MAP

| If You Want To Modify... | Primary File to Edit | Key Lines / Functions |
| :--- | :--- | :--- |
| **Headline Name / Hero Titles** | [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx) | Lines 37–46 (`<h1>SIJOMON P S</h1>`) |
| **Hero Pitch & Intro Blurb** | [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx) | Lines 52–56 |
| **Hero Social & Action Links** | [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx) | Lines 58–157 (GitHub, LinkedIn, Email, Resume, Phone) |
| **Hero Background Image / Vignette** | [`app/components/sections/HeroVideoBackground.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/HeroVideoBackground.tsx) | Lines 11–28 (`/hero/hero-poster.webp`) |
| **Floating Background Tech Words** | [`app/components/common/FloatingElements.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/FloatingElements.tsx) | Lines 6–11 (`allTechWords` array) |
| **About Bio, Story & Goals** | [`app/components/sections/About.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/About.tsx) | Lines 30–65 |
| **Profile Photo (Avatar)** | [`public/avatar.jpg`](file:///home/sijomonps/Code/sijomonps.github.io/public/avatar.jpg) & [`About.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/About.tsx) | Replace binary or edit line 18 in `About.tsx` |
| **Technical Skills & Categories** | [`app/components/sections/MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx) | Lines 33–80 (`skillsByCategory` array) |
| **Education History / Degrees** | [`app/components/education/CourseTimeline.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education/CourseTimeline.tsx) | Lines 13–34 (`educationTimeline` array) |
| **Certifications & Hackathons** | [`app/components/sections/Experience.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Experience.tsx) | Lines 12–40 (`highlights` array) |
| **Featured Projects & Links** | [`app/components/sections/Projects.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Projects.tsx) | Lines 19–71 (`projects` array) |
| **Contact Links & Social Accounts** | [`app/components/sections/Contact.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Contact.tsx) | Lines 15–51 (`contactItems` array) |
| **Top Navigation Links & Labels** | [`app/components/common/Navbar.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/Navbar.tsx) | Lines 5–13 (`navItems` array) |
| **Bottom Jump Pill & Mobile Menu** | [`app/components/common/SectionJumpToggle.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/SectionJumpToggle.tsx) | Lines 11–19 (`sections` array) |
| **Background & Foreground Colors** | [`app/globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css) & [`tailwind.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/tailwind.config.ts) | Lines 5–10 in `globals.css` |
| **Display & Body Typography** | [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx) | Lines 6–17 (Google Font configuration) |
| **Global SEO Metadata & OpenGraph** | [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx) | Lines 26–96 (`metadata` export) |
| **JSON-LD Structured Data Schema** | [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx) | Lines 98–167 (`jsonLd` object) |
| **Resume PDF File** | [`public/Resume.pdf`](file:///home/sijomonps/Code/sijomonps.github.io/public/Resume.pdf) | Replace PDF binary file |
| **Build & Export Configuration** | [`next.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/next.config.ts) | Static export, trailing slash, image settings |
| **GitHub Deployment Workflow** | [`.github/workflows/deploy.yml`](file:///home/sijomonps/Code/sijomonps.github.io/.github/workflows/deploy.yml) | Build commands, cache keys, GitHub Actions steps |

---

## 22. CURRENT ARCHITECTURE DIAGRAM

```text
+-------------------------------------------------------------------------+
|                                BROWSER                                  |
|   (Loads https://sijomonps.github.io/ -> Pre-rendered HTML + Hydrates)  |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                                NEXT.JS                                  |
|               (App Router - Static Export 'output: export')              |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                                ROUTES                                   |
|   /                 -> Pre-rendered index.html                          |
|   /sitemap.xml      -> app/sitemap.ts (force-static)                    |
|   /robots.txt       -> app/robots.ts (force-static)                     |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           ROOT LAYOUT & PAGE                            |
|   RootLayout (app/layout.tsx) [Server Component]                        |
|   ├── Google Fonts (Bebas Neue & Plus Jakarta Sans)                     |
|   ├── SEO Metadata, OpenGraph & JSON-LD Person/WebSite Schema           |
|   └── Home (app/page.tsx) ['use client']                                |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                           CLIENT COMPONENTS                             |
|                                                                         |
|   [Top Nav]    Navbar                                                   |
|   [Sections]   Hero (HeroVideoBackground + FloatingElements)            |
|                About                                                    |
|                MySkills                                                 |
|                Education (CourseTimeline)                               |
|                Experience (GradientBackground)                          |
|                Projects (GradientBackground)                            |
|                Contact (GradientBackground)                             |
|   [Floating]   SectionJumpToggle (Next Button & Mobile Modal)           |
|   [Shared]     AnimatedText (Framer Motion 3D Reveal on Viewport)       |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                         DATA, LOGIC & ASSETS                            |
|                                                                         |
|   Static Data Arrays:   navItems, allTechWords, skillsByCategory,       |
|                         educationTimeline, highlights, projects,        |
|                         contactItems, sections                          |
|   Static Assets:        public/hero/hero-poster.webp, avatar.jpg,       |
|                         Resume.pdf, SVG icons, custom cursor SVG        |
|   Build / Host:         GitHub Actions (.github/workflows/deploy.yml)   |
|                         -> Published to GitHub Pages CDN                |
+-------------------------------------------------------------------------+
```

---

## 23. IMPORTANT FINDINGS

### What Is Already Good
* **Clean, cohesive visual design**: The dark luxury theme, custom cursor, ambient glowing background orbs, and subtle Framer Motion reveals provide a polished, premium aesthetic.
* **Rigorous SEO**: Full OpenGraph tags, Twitter cards, Google Site Verification, XML sitemap, robots.txt, and comprehensive Schema.org JSON-LD Person/WebSite graphs.
* **Modern tech foundation**: Built on Next.js 16, React 19, TypeScript strict mode, and Tailwind CSS.
* **Robust, zero-maintenance CI/CD**: Automatic static builds and deployments to GitHub Pages on pushes to `main`.

### What Should Probably Be Improved Later
* **Content centralization**: Refactor hardcoded data arrays out of component files into a dedicated `data/` directory (e.g. `data/portfolio.ts`) to avoid duplicate data entry across files.
* **Remove unused assets**: Delete the 2.5 MB `public/hero/hero-video.mp4`, 132 KB of unused Geist WOFF fonts in `app/fonts/`, and `triangle-pointer-24-black.svg`.
* **Fix linter warnings**: Remove unused `SiPython` and `MdDevices` imports in `MySkills.tsx`, and assign the PostCSS config object to a named variable before export.
* **Synchronize navigation labels**: Align the section ID (`#experience`), its heading ("Certifications and Involvement"), and its navigation label ("Highlights").
* **Animation performance**: Consider switching `viewport={{ once: false }}` to `viewport={{ once: true }}` in `AnimatedText.tsx` to stop GPU churn on repeated scrolling.

### Potential Risks
* **Static Export Constraints**: Because `output: "export"` is enabled, you cannot add Next.js API route handlers, Server Actions, middleware, or dynamic Node.js server dependencies without migrating hosting off GitHub Pages.
* **Image Optimization Disabled**: `images: { unoptimized: true }` means images are served at their original file sizes. Adding large raw PNGs/JPEGs will directly degrade Lighthouse scores and page weight.
* **Linux Case-Sensitivity**: Assets like `public/Resume.pdf` and component imports must match file casing exactly; otherwise, local development on macOS/Windows might succeed while GitHub Actions builds on Ubuntu will fail.

### Things to Understand Before Modifying
* Any changes to section `id` attributes (e.g. `#home`, `#about`, `#skills`, `#education`, `#experience`, `#projects`, `#contact`) will break scroll navigation in both `Navbar.tsx` and `SectionJumpToggle.tsx` unless updated in tandem.
* Changes to contact information (email, phone, location) must be updated in three distinct locations: `Hero.tsx`, `Contact.tsx`, and the JSON-LD / metadata blocks in `layout.tsx`.

---

## 24. FINAL PROJECT SUMMARY

* **PROJECT**: `my-portfolio` (Sijomon P S Personal Developer Portfolio)
* **TECH STACK**: Next.js 16.2.2, React 19.2.4, TypeScript 5.7.2, Tailwind CSS 3.4.17, Framer Motion 12.38.0, React Icons 5.6.0
* **NEXT.JS ARCHITECTURE**: App Router (`app/`), 100% Static HTML Export (`output: "export"`), Server Component layout with Client Component interactive page
* **MAIN ROUTES**:
  * `/` (Landing page)
  * `/sitemap.xml` (Static XML sitemap)
  * `/robots.txt` (Static crawlers configuration)
* **MAIN SECTIONS**: Hero (`#home`), About (`#about`), Technical Skills (`#skills`), Education (`#education`), Highlights/Certifications (`#experience`), Featured Projects (`#projects`), Contact (`#contact`)
* **DATA SOURCES**: In-code TypeScript arrays and hardcoded JSX strings (no CMS, no database, no external APIs)
* **IMPORTANT COMPONENTS**:
  * [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx): Root layout, Google Fonts, JSON-LD, SEO
  * [`app/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/page.tsx): Main page orchestrator
  * [`app/components/common/Navbar.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/Navbar.tsx): Sticky top nav with sliding indicator
  * [`app/components/common/SectionJumpToggle.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/SectionJumpToggle.tsx): Bottom jump pill and mobile drawer
  * [`app/components/common/AnimatedText.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/AnimatedText.tsx): Framer Motion 3D reveal wrapper
  * [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx): Hero display and action buttons
  * [`app/components/sections/Projects.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Projects.tsx): Featured project showcase
* **IMPORTANT CONFIG FILES**: [`next.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/next.config.ts), [`tailwind.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/tailwind.config.ts), [`tsconfig.json`](file:///home/sijomonps/Code/sijomonps.github.io/tsconfig.json), [`eslint.config.mjs`](file:///home/sijomonps/Code/sijomonps.github.io/eslint.config.mjs), [`.github/workflows/deploy.yml`](file:///home/sijomonps/Code/sijomonps.github.io/.github/workflows/deploy.yml)
* **EXTERNAL SERVICES**: GitHub Pages (Static hosting), Google Search Console (Verification)
* **DEPLOYMENT**: GitHub Actions pipeline triggering on push to branch `main`, building static artifact to `./out` and deploying to GitHub Pages
* **MAIN STYLING SYSTEM**: Tailwind CSS with CSS variables (`--background: #09090b`, `--foreground: #f4f4f5`), Bebas Neue & Plus Jakarta Sans Google Fonts, dark mode locked
* **MAIN ANIMATION SYSTEM**: Framer Motion (reveals and floating keywords), CSS transitions (sliding underline, glow fades), custom SVG pointer cursor
* **KNOWN ISSUES**:
  * Unused imports (`SiPython`, `MdDevices`) in `MySkills.tsx`
  * PostCSS anonymous default export lint warning
  * Invalid unconfigured `xs:` classes in `Hero.tsx`
  * Mismatch between section `#experience`, title "Certifications and Involvement", and nav label "Highlights"
* **POTENTIAL DEAD CODE**:
  * `public/hero/hero-video.mp4` (2.5 MB unused video)
  * `app/fonts/GeistMonoVF.woff` & `GeistVF.woff` (132 KB unused fonts)
  * `public/cursors/triangle-pointer-24-black.svg` (unused cursor)
* **IMPORTANT FILES TO MODIFY**:
  * Hero info: [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx)
  * About text: [`app/components/sections/About.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/About.tsx)
  * Skills list: [`app/components/sections/MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx)
  * Education: [`app/components/education/CourseTimeline.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education/CourseTimeline.tsx)
  * Certifications/Highlights: [`app/components/sections/Experience.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Experience.tsx)
  * Projects: [`app/components/sections/Projects.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Projects.tsx)
  * Contact & Socials: [`app/components/sections/Contact.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Contact.tsx)
  * Global SEO/Schema: [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx)
  * Global Styles/Theme: [`app/globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css) & [`tailwind.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/tailwind.config.ts)

---

# AI MODIFICATION CONTEXT

### 1. How this portfolio is currently structured
This project is an ultra-fast, statically-exported single-page application built on Next.js 16 (App Router), React 19, and Tailwind CSS. The entire site is assembled inside [`app/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/page.tsx), which imports independent section components from [`app/components/sections/`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections) and [`app/components/education/CourseTimeline.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education/CourseTimeline.tsx). There are no database calls or API routes. All textual content, links, project descriptions, and skill lists exist as inline TypeScript arrays and JSX elements within their respective section files.

### 2. Where the most important UI/content changes should be made
* **Personal Profile & Intro**: Edit [`app/components/sections/Hero.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Hero.tsx) (headline, bio, resume link, contact links) and [`app/components/sections/About.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/About.tsx) (narrative paragraphs and avatar).
* **Technical Skills**: Edit the `skillsByCategory` array in [`app/components/sections/MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx). Remember to import matching brand icons from `react-icons/si` or `react-icons/fa6`.
* **Projects Showcase**: Edit the `projects` array in [`app/components/sections/Projects.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Projects.tsx).
* **Education & Certifications**: Edit `educationTimeline` in [`app/components/education/CourseTimeline.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/education/CourseTimeline.tsx) and `highlights` in [`app/components/sections/Experience.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Experience.tsx).
* **Contact & Social Links**: Edit `contactItems` in [`app/components/sections/Contact.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/Contact.tsx).
* **Visual Theme & Typography**: Change CSS variables in [`app/globals.css`](file:///home/sijomonps/Code/sijomonps.github.io/app/globals.css) and Google Fonts in [`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx).

### 3. Which files should be handled carefully because other parts depend on them
* **[`app/components/common/Navbar.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/Navbar.tsx) and [`app/components/common/SectionJumpToggle.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/SectionJumpToggle.tsx)**: Both components contain hardcoded lists of section IDs (`#home`, `#about`, `#skills`, `#education`, `#experience`, `#projects`, `#contact`). If you rename or remove any section element ID in a section component or in `app/page.tsx`, you **must** update both navigation components in tandem; otherwise, scroll tracking, underline positioning, and section jumping will malfunction.
* **[`app/layout.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/layout.tsx)**: Contains the JSON-LD schema graph, canonical alternates, OpenGraph metadata, and Google font CSS variables. Any change to contact details (phone, email, URLs) must be mirrored here to keep search engine structured data in sync.
* **[`app/components/common/AnimatedText.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/common/AnimatedText.tsx)**: Used by virtually every section. Modifying props, easing, or layout classes in this component will alter entrance animations across the entire website simultaneously.

### 4. Technical constraints future modifications must preserve
* **Static Export Requirement (`output: 'export'`)**: The project deploys to GitHub Pages as static HTML. Never introduce server actions, middleware, node runtime APIs, or dynamic API routes unless the hosting infrastructure is migrated to Vercel, Render, or a Node.js container.
* **Unoptimized Images**: Because static export cannot invoke Next.js image optimization, `images.unoptimized: true` must remain enabled in [`next.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/next.config.ts). When adding images, compress and resize them manually beforehand to keep page loads fast.
* **Strict Case Sensitivity**: The GitHub Actions runner runs on Ubuntu Linux (`ubuntu-latest`). All asset filenames (such as `Resume.pdf`) and component import paths must match disk casing precisely.
