"use client"

import { X, Plus, User, Search } from "lucide-react"

const menuItems = [
  { title: "TRENDING", href: "/trending" },
  { title: "NEWS & DEALS", href: "/news" },
  { title: "REVIEWS", href: "/reviews" },
  { title: "BEST GUIDES", href: "/guides" },
  { title: "TUTORIALS", href: "/tutorials" },
  { title: "THREADS", href: "/threads" },
  { title: "TOPICS", href: "/topics" },
]

export default function Navigation({ onClose }) {
  return (
    <div className="fixed inset-0 bg-[#1a1a1a] z-50">
      <div className="flex justify-between p-4">
        <button className="p-2">
          <Search className="w-6 h-6" />
        </button>
        <button onClick={onClose} className="p-2">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="px-4 py-8">
        {menuItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="flex items-center justify-between py-4 text-2xl font-light border-b border-gray-800"
          >
            {item.title}
            <Plus className="w-6 h-6 text-purple-500" />
          </a>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button className="flex items-center gap-2 text-xl">
          <User className="w-6 h-6" />
          Sign In
        </button>
      </div>
    </div>
  )
}

