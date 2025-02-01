"use client"

import { useState, useEffect } from "react"
import { Menu, Search, User, X, Edit, Trash, LogOut } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, Toaster } from "react-hot-toast"
import axios from 'axios'
// import { uploadFileAndGetUrl } from '../helper/uploadFile'; // Ensure correct path
import uploadFile from '../helper/uploadFile';


const initialMenuItems = ["TRENDING", "NEWS & DEALS", "REVIEWS", "BEST GUIDES", "TUTORIALS", "THREADS", "TOPICS"]

const initialArticles = [
  {
    id: 1,
    title: "Radeon RX 6800 XT",
    subtitle: "The veteran marches on",
    category: "REVIEWS",
    content:
      "AMD's RX 6800 XT might have entered its fifth year, but its 16GB VRAM capacity still keeps it contending as one of the best cards any gamer could buy, especially if they choose to stick with a 1080p gaming experience. Even at 1440p, the RX 6800 XT delivers raw performance that its direct competitor, the RTX 4070, barely catches up with.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20250128_090838_Chrome.jpg-YpkQrTaXtmAp8in2ie7NHnl4F436VQ.jpeg",
  },
  {
    id: 2,
    title: "Latest Gaming Tech",
    subtitle: "Next-gen performance review",
    category: "TRENDING",
    content:
      "An in-depth look at the latest gaming technology and how it impacts modern gaming experiences. This article covers the newest consoles, graphics cards, and gaming peripherals that are shaping the future of interactive entertainment.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Tech Tutorials",
    subtitle: "Getting started with PC building",
    category: "TUTORIALS",
    content:
      "A comprehensive guide for beginners looking to build their first gaming PC. This tutorial walks you through selecting components, assembling the hardware, and setting up your new system for optimal performance.",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function Home() {
  const [Cthumbnail, setCThumbnail] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [articles, setArticles] = useState()
  const [editingArticle, setEditingArticle] = useState(null)
  const [showFullContent, setShowFullContent] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("")
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [newCategory, setNewCategory] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState({})
  const [thumbnail, setThumbnail] = useState(null);

  const handleThumbnailChange = async(e) => {

    setThumbnail(e.target.files[0]);   

  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.post('/api/getallblog');
     
        if (response?.data?.success) {
          setArticles(response?.data?.data);
          // setArticles(initialArticles);

        } else {
          setError(data.error);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredArticles = articles?.filter((article) => {
  
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory ? article.category === activeCategory : true

    return matchesSearch && matchesCategory
  })

  const handleAddOrEditArticle = async (e) => {
    e.preventDefault()
    // const img = await uploadFileAndGetUrl(thumbnail);
    const uploadPhoto = await uploadFile(thumbnail)

    const formData = new FormData(e.target)
    const newArticle = {
      //id: editingArticle ? editingArticle.id : Date.now(),
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      category: formData.get("category"),
      content: formData.get("content"),
      image: uploadPhoto.url || "/placeholder.svg?height=400&width=600",
    }

    try {
      const response = await fetch('/api/addblog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArticle)
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Article added successfully")
      } else {
        console.error("Error creating article:", data.error);
        toast.success("Error creating article:", data.error)
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // if (editingArticle) {
    //   setArticles(articles.map((article) => (article.id === editingArticle.id ? newArticle : article)))
    //   toast.success("Article updated successfully")
    // } else {
    //   setArticles([...articles, newArticle])
    //   toast.success("Article added successfully")
    // }
    setEditingArticle(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteArticle = async () => {
    if (articleToDelete) {
      const response = await axios.post('/api/deleteblog', { id: articleToDelete._id });
      toast.success("Article deleted ", response)
      setArticles(articles.filter((article) => article._id !== articleToDelete._id))
      setArticleToDelete(null)
      setIsDeleteDialogOpen(false)
      toast.success("Article deleted successfully")
    }
  }



  const toggleReadMore = (id) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle current article state
    }))
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (newCategory && !menuItems.includes(newCategory.toUpperCase())) {
      setMenuItems([...menuItems, newCategory.toUpperCase()])
      setNewCategory("")
      toast.success("Category added successfully")
    }
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setMenuItems(menuItems.filter((item) => item !== categoryToDelete))
      setArticles(articles.filter((article) => article.category !== categoryToDelete))
      setCategoryToDelete(null)
      setIsDeleteCategoryDialogOpen(false)
      toast.success("Category deleted successfully")
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === process.env.NEXT_PUBLIC_email && password === process.env.NEXT_PUBLIC_pass) {
      setIsAdmin(true)
      setIsLoginDialogOpen(false)
      toast.success("Logged in as admin")
    } else {
      toast.error("Invalid credentials")
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    toast.success("Logged out successfully")
  }

  // useEffect(() => {
  //   if (!isMenuOpen) {
  //     setActiveCategory("")
  //   }
  // }, [isMenuOpen])

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Toaster />
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>

          <div className="text-2xl font-bold">TECH NEWS</div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 bg-[#242424] rounded"
            />
            {isAdmin ? (
              <button onClick={handleLogout} className="p-2">
                <LogOut className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={() => setIsLoginDialogOpen(true)} className="p-2">
                <User className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#1a1a1a] z-50 overflow-y-auto">
          <div className="flex justify-between p-4">
            <button className="p-2">
              <Search className="w-6 h-6" />
            </button>
            <button onClick={() => setIsMenuOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="px-4 py-8">
            {menuItems.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-4 text-2xl font-light border-b border-gray-800"
              >
                <button
                  onClick={() => {
                    setActiveCategory(item)
                    setIsMenuOpen(false)
                  }}
                  className="flex-grow text-left"
                >
                  {item}
                </button>
                {/* {isAdmin && (
                  <button
                    onClick={() => {
                      setCategoryToDelete(item)
                      setIsDeleteCategoryDialogOpen(true)
                    }}
                    className="text-red-500"
                  >
                    <Trash className="w-6 h-6" />
                  </button>
                )} */}
              </div>
            ))}
          </nav>

          {/* {isAdmin && (
            <form onSubmit={handleAddCategory} className="px-4 py-8 border-t border-gray-800">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category"
                className="w-full p-2 mb-2 bg-[#242424] rounded"
              />
              <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
                Add Category
              </button>
            </form>
          )} */}
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingArticle(null)
              setIsEditDialogOpen(true)
            }}
            className="mb-4"
          >
            Add New Article
          </Button>
        )}

{filteredArticles &&
        filteredArticles.map((article) => (
          <div key={article._id} className="mb-8 bg-[#242424] rounded-lg overflow-hidden">
            <div className="p-4">
              <h1 className="text-4xl font-bold mb-2">{article?.title}</h1>
              <h2 className="text-2xl text-gray-400 mb-4">{article?.subtitle}</h2>
              <p className="text-sm text-purple-500 mb-2">{article?.category}</p>
            </div>
            <div className="relative h-64 w-full">
              <Image src={article.image || "/placeholder.svg"} alt={article?.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <p className="text-lg leading-relaxed text-gray-300 text-wrap bg">
                {expandedArticles[article._id] ? article.content : `${article.content.substring(0, 150)}...`}
                {/* {article?.content} */}
              </p>
              {article.content.length > 150 && (
                <button
                  onClick={() => toggleReadMore(article._id)}
                  className="text-purple-500 mt-2"
                >
                  {expandedArticles[article._id] ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            {isAdmin && (
              <div className="p-4 flex justify-end gap-2">
                {/* <Button
                  onClick={() => {
                    setEditingArticle(article)
                    setIsEditDialogOpen(true)
                  }}
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button> */}
                <Button
                  onClick={() => {
                    setArticleToDelete(article)
                    setIsDeleteDialogOpen(true)
                  }}
                  variant="destructive"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOrEditArticle}>
            <div className="grid gap-4 py-4">
              <Input name="title" defaultValue={editingArticle?.title} placeholder="Title" required />
              <Input name="subtitle" defaultValue={editingArticle?.subtitle} placeholder="Subtitle" required />
              <Select name="category" defaultValue={editingArticle?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea name="content" defaultValue={editingArticle?.content} placeholder="Content" required />
              <Input id="thumbnail" defaultValue={editingArticle?.image} name="image" type="file"  onChange={handleThumbnailChange} accept="image/*" required />
              {/* <Input name="image" defaultValue={editingArticle?.image} placeholder="Image URL" /> */}
            </div>
            <DialogFooter>
              <Button type="submit">{editingArticle ? "Update Article" : "Add Article"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this article? This action cannot be undone.</p>
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDeleteArticle} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Login</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Category Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this category? This action cannot be undone and will remove all articles in
            this category.
          </p>
          <DialogFooter>
            <Button onClick={() => setIsDeleteCategoryDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDeleteCategory} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

