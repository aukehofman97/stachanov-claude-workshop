import './globals.css'

export const metadata = {
  title: 'Subventia Oracle',
  description: 'Grant eligibility pre-screener',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC]">
        <header className="bg-[#003366]">
          <div className="max-w-3xl mx-auto px-6 py-5">
            <div className="flex items-baseline gap-3">
              <h1 className="text-white text-lg font-semibold tracking-tight">
                Subventia Oracle
              </h1>
              <span className="text-[#93C5FD] text-xs">
                Grant eligibility pre-screener
              </span>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
