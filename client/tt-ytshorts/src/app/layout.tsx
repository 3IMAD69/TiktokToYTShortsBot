import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tik To Shorts - The Ultimate TikTok to YouTube Shorts Converter App',
  description: 'TikTok to Youtube Shorts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
         </ThemeProvider>
        </body>
    </html>
  )
}
