import "./globals.css"

export const metadata = {
  title: "Tech News & Reviews",
  description: "Latest technology news, reviews, and tutorials",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a1a] text-white min-h-screen">{children}</body>
    </html>
  )
}

