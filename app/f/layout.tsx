import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Area | Sijomon P S',
  description: 'Private Personal Area — Finance and To-do Management',
  robots: {
    index: false,
    follow: false,
  },
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-white/20">
      {children}
    </div>
  );
}
