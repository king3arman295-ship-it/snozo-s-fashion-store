import { useState } from "react"
import axios from "axios"
import { API_URL } from "../config"

function AdminAddProduct() {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const addProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")

    try {

      // KEEP SAME STRUCTURE (no backend break)
      const productData = {
        name,
        price,
        image,
        category,
        description
      }

      // ✅ FIXED API CALL (NO double /api)
      const res = await axios.post(
        `${API_URL}/products`,
        productData
      )

      setSuccess(res.data.message || "Product added successfully ✔")

      // reset form
      setName("")
      setPrice("")
      setImage("")
      setCategory("")
      setDescription("")

    } catch (error) {
      console.log("Add product error:", error)
      setSuccess("Failed to add product ❌")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">

      <div className="w-full max-w-2xl bg-gray-900 p-10 rounded-3xl border border-gray-800">

        <h1 className="text-5xl font-bold mb-10 text-center">
          Add Product
        </h1>

        <form onSubmit={addProduct} className="space-y-6">

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black border border-gray-700"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black border border-gray-700"
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black border border-gray-700"
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black border border-gray-700"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black border border-gray-700 h-40"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </form>

        {success && (
          <div className="mt-6 text-center text-green-400 text-lg font-semibold">
            {success}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminAddProduct