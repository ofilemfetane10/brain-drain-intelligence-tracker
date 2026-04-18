import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Brain Drain Intelligence Tracker | AU Health Intelligence',
  description: 'Tracking physician and nurse emigration flows from African Union member states to European health systems. WHO NHWA + World Bank data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
