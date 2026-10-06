import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pathfinder AI | Zero to AI-Native Full Stack Engineer',
  description: 'AI-driven career planning and learning platform for absolute beginners. 30-minute micro-tasks, Socratic AI mentor, and peer squads.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
