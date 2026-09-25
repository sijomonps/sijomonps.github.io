import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sijomonps.github.io"),
  title: {
    default: "Sijomon P S — Full-Stack Developer in Kerala",
    template: "%s | Sijomon P S",
  },
  description:
    "Portfolio of Sijomon P S, a Full-Stack Developer based in Thiruvalla, Kerala. Building modern web applications from code to cloud with Next.js, React, Node.js, Python, and DevOps.",
  keywords: [
    "Sijomon P S",
    "Sijomon PS",
    "Full-Stack Developer",
    "Web Developer",
    "Full-Stack Developer Kerala",
    "Web Developer Kerala",
    "Web Developer Thiruvalla",
    "Web Developer Pathanamthitta",
    "Next.js Developer",
    "React Developer",
    "Python Developer",
    "Cloud DevOps",
  ],
  authors: [{ name: "Sijomon P S", url: "https://sijomonps.github.io" }],
  creator: "Sijomon P S",
  publisher: "Sijomon P S",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sijomonps.github.io",
    siteName: "Sijomon P S | Full-Stack Developer",
    title: "Sijomon P S — Full-Stack Developer in Kerala",
    description:
      "Portfolio of Sijomon P S, a Full-Stack Developer based in Thiruvalla, Kerala. Building modern web applications from code to cloud with Next.js, React, and DevOps.",
    images: [
      {
        url: "/avatar.jpg",
        width: 800,
        height: 800,
        alt: "Sijomon P S — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sijomon P S — Full-Stack Developer in Kerala",
    description:
      "Portfolio of Sijomon P S, a Full-Stack Developer based in Thiruvalla, Kerala. Building modern web applications from code to cloud.",
    images: ["/avatar.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "TtdBbPpWogDiMgSiuz6zjh3gKCrhS_Ec_p8urZ-ZziM",
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sijomonps.github.io/#person",
      name: "Sijomon P S",
      alternateName: ["Sijomon PS", "Sijomon"],
      jobTitle: "Full-Stack Developer",
      description:
        "Full-Stack Developer from Thiruvalla, Kerala, India specializing in web applications, cloud technologies, and DevOps.",
      url: "https://sijomonps.github.io",
      image: "https://sijomonps.github.io/avatar.jpg",
      email: "mailto:sijomon700@gmail.com",
      telephone: "+916235719647",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Thiruvalla",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      sameAs: [
        "https://github.com/sijomonps",
        "https://www.linkedin.com/in/sijomonps/",
      ],
      knowsAbout: [
        "Full-Stack Development",
        "Web Development",
        "Next.js",
        "React",
        "TypeScript",
        "JavaScript",
        "Python",
        "Django",
        "Node.js",
        "Docker",
        "DevOps",
        "Cloud Computing",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://sijomonps.github.io/#website",
      url: "https://sijomonps.github.io",
      name: "Sijomon P S Portfolio",
      description:
        "Official portfolio of Sijomon P S, Full-Stack Developer in Thiruvalla, Kerala.",
      publisher: {
        "@id": "https://sijomonps.github.io/#person",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": "https://sijomonps.github.io/#webpage",
      url: "https://sijomonps.github.io",
      name: "Sijomon P S — Full-Stack Developer in Kerala",
      isPartOf: {
        "@id": "https://sijomonps.github.io/#website",
      },
      about: {
        "@id": "https://sijomonps.github.io/#person",
      },
      mainEntity: {
        "@id": "https://sijomonps.github.io/#person",
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable} font-sans antialiased`}>
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`(() => {
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
