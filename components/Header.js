"use client"

import { Menu, Search, User } from "lucide-react"
import { useState } from "react"
import Navigation from "./Navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsMenuOpen(true)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>

        <div className="text-2xl font-bold">TECH NEWS</div>

        <div className="flex gap-4">
          <button className="p-2">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isMenuOpen && <Navigation onClose={() => setIsMenuOpen(false)} />}
    </header>
  )
}

