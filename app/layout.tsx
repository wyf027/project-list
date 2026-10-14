import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "我的项目集合",
  description: "展示个人项目和技术实验的作品集",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark" style={{ colorScheme: "dark" }}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
