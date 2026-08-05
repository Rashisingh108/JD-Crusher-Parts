'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Machine = {
  id: number
  name: string
  price: number
  description: string
  type: string
  images: string[]
}

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [selectedItem, setSelectedItem] = useState<Machine | null>(null)
  const [machines, setMachines] = useState<Machine[]>([])
  const [theme, setTheme] = useState('dark')
  const [currentImage, setCurrentImage] = useState(0) // <-- YE AB UPAR AA GAYA

  const whatsappNumber = "919893543392"

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark'? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  useEffect(() => {
    const fetchMachines = async () => {
      const { data } = await supabase.from('machines').select('*').order('id', {ascending: false})
      if(data) setMachines(data)
    }
    fetchMachines()
  }, [])

  // Jab bhi naya item select ho to image 0 pe reset
  useEffect(() => {
    setCurrentImage(0)
  }, [selectedItem])

  const categories = [
    {name: "All", icon: "🏭", label: "All Items"},
    {name: "Machine", icon: "⚙️", label: "Machines"},
    {name: "Parts", icon: "🔩", label: "Spare Parts"},
    {name: "New", icon: "✨", label: "New"},
    {name: "Used", icon: "♻️", label: "Used"}
  ]

  const filtered = machines.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "All" || item.type === filter
    return matchSearch && matchFilter
  })

  const nextImage = () => {
    if(selectedItem) setCurrentImage((prev) => (prev + 1) % selectedItem.images.length)
  }
  const prevImage = () => {
    if(selectedItem) setCurrentImage((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length)
  }

  // DETAIL PAGE
  if (selectedItem) {
    return (
      <div className="font-sans bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen p-5">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-5">
          <button onClick={() => setSelectedItem(null)} className="bg-[#1B365D] text-white px-5 py-2 rounded-lg mb-4">← Back to Listings</button>

          {/* IMAGE SLIDER */}
          {selectedItem.images && selectedItem.images.length > 0 && (
            <div className="relative">
              <img src={selectedItem.images[currentImage]} className="w-full h-72 object-cover rounded-lg"/>
              {selectedItem.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">←</button>
                  <button onClick={nextImage} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">→</button>
                  <div className="flex justify-center gap-2 mt-2">
                    {selectedItem.images.map((_, index) => (
                      <button key={index} onClick={() => setCurrentImage(index)} className={`w-2 h-2 rounded-full ${currentImage === index? 'bg-[#D4AF37]' : 'bg-gray-400'}`}></button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <h1 className="text-[#1B365D] dark:text-white text-2xl font-bold my-4">{selectedItem.name}</h1>
          <p className="text-[#D4AF37] font-bold text-2xl">₹ {selectedItem.price.toLocaleString('en-IN')}</p>
          <p className="leading-6 text-gray-700 dark:text-gray-300 mt-4">{selectedItem.description}</p>
          <a href={`https://wa.me/${whatsappNumber}?text=Hi, I am interested in ${selectedItem.name}`} target="_blank" className="bg-[#25D366] text-white p-4 rounded-lg font-bold inline-block mt-5 w-full text-center">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    )
  }

  // HOME PAGE - yaha kuch change nahi
  return (
    <div className="font-sans bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col">
      <div className="bg-[#1B365D] text-white p-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-24 h-24 rounded-3xl"/>
            <div>
              <h1 className="text-2xl font-bold m-0">JD CRUSHER PARTS</h1>
              <p className="text-[#D4AF37] font-bold m-0 text-xs">New Se Used Tak, Parts Se Service Tak</p>
            </div>
          </div>
          
           <a href={`https://wa.me/${whatsappNumber}?text=Hi, I need Crusher Maintenance Service`} target="_blank" style={{backgroundColor: '#D4AF37', color: 'white', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>
              🔧 Contact for Crusher Maintenance
            </a>

        </div>
      </div>

      <div className="bg-gradient-to-r from-[#D4AF37] to-orange-400 text-white p-5 text-center">
        <h2 className="text-2xl font-bold m-0 mb-2">20+ Years of Experience</h2>
        <p className="text-base m-0">Trusted Dealer in Bhopal</p>
      </div>

      <div className="flex-1">
        <div className="bg-white dark:bg-gray-800 p-4">
          <div className="max-w-6xl mx-auto flex justify-around flex-wrap gap-3">
            {categories.map((cat) => (
              <div key={cat.name} onClick={() => setFilter(cat.name)} className={`text-center cursor-pointer p-2 rounded-xl border-2 ${filter === cat.name? 'bg-[#FFF0E0] border-[#D4AF37]' : 'bg-transparent border-transparent'}`}>
                <div className="text-3xl">{cat.icon}</div>
                <div className="text-sm font-bold text-[#1B365D] dark:text-white">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-5">
          <input type="text" placeholder="🔍 Search: Crusher, Bearing, Motor..." className="w-full p-3 border-2 border-[#1B365D] rounded-lg text-base mb-5 box-border bg-white dark:bg-gray-700 dark:text-white" value={search} onChange={(e) => setSearch(e.target.value)}/>

          {filtered.length === 0? (
            <p className="text-center text-gray-500 dark:text-gray-400">No items found.</p>
          ) : (     
            <div className="flex flex-col gap-4">
              {filtered.map((item) => (
                <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md cursor-pointer flex flex-row p-3 gap-3">
                  {item.images && item.images[0] && <img src={item.images[0]} className="w-24 h-24 object-cover rounded-lg"/>}
                  <div className="flex-1">
                    <p className="font-bold text-[#1B365D] dark:text-white text-base m-0 mb-1">{item.name}</p>
                    <p className="text-[#D4AF37] font-bold text-lg m-0 mb-1">₹ {item.price.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mb-1">{item.type}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 m-0">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1B365D] text-white p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#D4AF37] text-lg mb-3">JD CRUSHER PARTS</h3>
          </div>
          <div>
            <h3 className="text-[#D4AF37] text-lg mb-3">Contact Us</h3>
            <p className="text-sm my-1">📍 Address: Industrial Area, Bhopal, MP 462023</p>
            <p className="text-sm my-1">📞 Phone: +91 9893543392</p>
             <p>
      📧 Email: <a href="mailto:kuldeep545@gmail.com" style={{color: '#ffcc00'}}>
        kuldeep545@gmail.com
      </a>
    </p>
          </div>
          <div>
            <h3 className="text-[#D4AF37] text-lg mb-3">Quick Links</h3>
            <Link href="/admin" className="block text-yellow-400 text-sm my-1 hover:underline">⚙️ Admin Panel</Link>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="block text-[#25D366] text-sm my-1">💬 WhatsApp Us</a>
          </div>
        </div>
        <div className="text-center mt-8 pt-5 border-t border-[#1a4a8c] text-xs text-gray-400">
          © 2026 JD CRUSHER PARTS. All Rights Reserved.
        </div>
      </div>
    </div>
  )
}