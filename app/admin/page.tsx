'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = "jdadmin123"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [machines, setMachines] = useState<any[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("Machine")
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => { if(isLoggedIn) fetchMachines() }, [isLoggedIn])

  const fetchMachines = async () => {
    const { data } = await supabase.from('machines').select('*').order('id', { ascending: false })
    setMachines(data || [])
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) setIsLoggedIn(true)
    else alert('Incorrect Password!')
  }

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if(!files) return
  setUploading(true)
  let newImages: string[] = [...images]

  for(let i = 0; i < files.length; i++){
    const file = files[i]
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`

    const { data, error } = await supabase.storage.from('jd-products').upload(fileName, file)

    if(error){
      alert(`Upload Error: ${error.message}`)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('jd-products').getPublicUrl(data.path);
      newImages.push(publicUrl)
    }
  }
  setImages(newImages)
  setUploading(false)
}
  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('machines').insert([{ name, price: Number(price), description, type, images }])
    if(error) alert(error.message)
    else {
      alert('Machine Added!')
      setName(""); setPrice(""); setDescription(""); setImages([])
      fetchMachines()
    }
  }

  const handleDelete = async (id: number) => {
    if(confirm("Delete this machine?")){
      await supabase.from('machines').delete().eq('id', id)
      fetchMachines()
    }
  }

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96"><h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1><input type="password" placeholder="Enter Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"/><button type="submit" className="w-full bg-[#1B365D] text-white p-2 rounded font-bold">Login</button></form></div>
  }

  return (
 // form ka band
// Yaha return ke andar hi gallery ka div aayega
  <div className="space-y-4">
    {/* Badi wali Main Image */}
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Machine</h2>
          <form onSubmit={handleAddMachine} className="space-y-4">
            <input placeholder="Machine Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" required/>
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" required/>
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" required/>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700">
              <option>Machine</option><option>Parts</option>
            </select>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700">
              <option>New</option><option>Used</option>
            </select>
            <input type="file" multiple onChange={handleImageUpload} className="w-full"/>
            {uploading && <p>Uploading...</p>}
            <div className="flex gap-2 flex-wrap">{images.map(img => <img key={img} src={img} className="w-20 h-20 object-cover rounded border"/>)}</div>
            <button type="submit" className="w-full bg-[#D4AF37] text-black p-2 rounded font-bold">Add Machine</button>
          </form>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">All Machines</h2>
          {machines.map(m => (
            <div key={m.id} className="flex justify-between items-center border-b py-2">
              <div><p className="font-bold">{m.name}</p><p className="text-sm">₹{m.price?.toLocaleString('en-IN')}</p><p className="text-xs">{m.images?.length} Images</p></div>
              <button onClick={() => handleDelete(m.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}