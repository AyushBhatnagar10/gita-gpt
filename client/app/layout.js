import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/shared/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GitaGPT | Your Spiritual AI Companion',
  description: 'Emotionally intelligent spiritual guidance from the Bhagavad Gita',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}