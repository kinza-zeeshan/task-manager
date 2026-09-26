import "./globals.css";
import Link from "next/link";
import Providers from "./providers";

export const metadata = { title: "Task Manager" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-muted/30">
        <Providers>
          <header className="border-b bg-background">
            <nav className="mx-auto flex max-w-5xl items-center gap-6 p-4">
              <span className="font-semibold">Task Manager</span>
              <Link href="/tasks" className="text-sm hover:underline">Tasks</Link>
              <Link href="/tasks/new" className="text-sm hover:underline">New Task</Link>
            </nav>
          </header>
          <main className="mx-auto max-w-5xl p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}     