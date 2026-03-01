import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'OVERWATCH | AI Scam Detection',
    description: 'Your AI Shield Against AI-Powered Scams. Upload suspicious media. Get a verdict in seconds.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
            <body className="font-sans antialiased text-[#f0f6ff] min-h-screen selection:bg-[#00ff88] selection:text-[#03050a]">
                <div className="absolute inset-0 z-[-1] bg-mesh pointer-events-none" />
                <div className="scanline-overlay" />
                {children}
                <Analytics />
            </body>
        </html>
    )
}
