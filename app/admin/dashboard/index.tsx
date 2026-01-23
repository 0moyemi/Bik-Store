"use client"
import { Edit, Trash2, Plus, LogOut, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FileUpload from "@/app/components/FileUpload"
import VideoUpload from "@/app/components/VideoUpload"
import { validateProductName, validatePrice, validateDescription, validateText } from "@/lib/validation"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  category: string
  features: string[]
  images: string[]
}

const AdminDashboard = () => {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Abaya',
    features: ['', ''],
    images: [] as string[],
    videos: [] as string[]
  })

  const [formErrors, setFormErrors] = useState({
    name: '',
    price: '',
    description: '',
    features: [] as string[]
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.status) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setFormErrors({ name: '', price: '', description: '', features: [] })

    // Validate product name
    const nameValidation = validateProductName(formData.name)
    if (!nameValidation.isValid) {
      setFormErrors(prev => ({ ...prev, name: nameValidation.error || '' }))
      setToast({ message: 'Please fix validation errors', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    // Validate price
    const priceValidation = validatePrice(formData.price)
    if (!priceValidation.isValid) {
      setFormErrors(prev => ({ ...prev, price: priceValidation.error || '' }))
      setToast({ message: 'Please fix validation errors', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    // Validate description
    const descriptionValidation = validateDescription(formData.description)
    if (!descriptionValidation.isValid) {
      setFormErrors(prev => ({ ...prev, description: descriptionValidation.error || '' }))
      setToast({ message: 'Please fix validation errors', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    // Validate features
    const featureErrors: string[] = []
    formData.features.forEach((feature, index) => {
      if (feature.trim() !== '') {
        const featureValidation = validateText(feature, `Feature ${index + 1}`, 2, 200)
        if (!featureValidation.isValid) {
          featureErrors[index] = featureValidation.error || ''
        }
      }
    })

    if (featureErrors.some(error => error !== '')) {
      setFormErrors(prev => ({ ...prev, features: featureErrors }))
      setToast({ message: 'Please fix validation errors in features', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    // Combine images and videos into one array
    const allMedia = [...formData.images, ...formData.videos]

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.filter(f => f.trim() !== ''),
      images: allMedia.filter(i => i.trim() !== '')
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      const data = await res.json()

      if (data.status) {
        setToast({ message: data.message, type: 'success' })
        setTimeout(() => setToast(null), 3000)
        setShowUploadForm(false)
        setEditingProduct(null)
        resetForm()
        setFormErrors({ name: '', price: '', description: '', features: [] })
        fetchProducts()
      } else {
        setToast({ message: data.message, type: 'error' })
        setTimeout(() => setToast(null), 3000)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      setToast({ message: 'Failed to save product', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.status) {
        setToast({ message: data.message, type: 'success' })
        setTimeout(() => setToast(null), 3000)
        fetchProducts()
      } else {
        setToast({ message: data.message, type: 'error' })
        setTimeout(() => setToast(null), 3000)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setToast({ message: 'Failed to delete product', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)

    // Separate images and videos based on URL patterns
    const productImages = product.images.filter(url =>
      !url.includes('/video/') && !url.match(/\.(mp4|webm|mov)$/i)
    )
    const productVideos = product.images.filter(url =>
      url.includes('/video/') || url.match(/\.(mp4|webm|mov)$/i)
    )

    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      features: product.features.length >= 2 ? product.features : [...product.features, ''],
      images: productImages,
      videos: productVideos
    })
    setShowUploadForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Abaya',
      features: ['', ''],
      images: [],
      videos: []
    })
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }))
  }

  const handleVideoUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, url]
    }))
  }

  const removeUploadedImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const removeUploadedVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const removeFeature = (index: number) => {
    if (formData.features.length > 2) {
      setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Product Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingProduct(null)
              resetForm()
              setShowUploadForm(!showUploadForm)
            }}
            className="glow-blue flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90"
          >
            <Plus size={18} />
            Add Product
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Upload/Edit Form */}
      {showUploadForm && (
        <div className="glass-strong rounded-lg p-6 mb-6 space-y-4 border border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              {editingProduct ? 'Edit Product' : 'Upload New Product'}
            </h2>
            <button
              onClick={() => {
                setShowUploadForm(false)
                setEditingProduct(null)
                resetForm()
              }}
              className="p-1 hover:bg-secondary rounded"
            >
              <X size={20} />
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Product Images Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Images {formData.images.length > 0 && `(${formData.images.length})`}
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                {formData.images.length === 0 ? 'Upload at least one image' : formData.images.length === 1 ? 'Add more images for carousel effect' : 'Multiple images for product carousel'}
              </p>

              {/* Preview uploaded images */}
              {formData.images.length > 0 && (
                <div className="mb-3 grid grid-cols-4 gap-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group glass-card rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-all shadow-lg"
                        title="Delete image"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-1 left-1 glass-interactive text-white text-xs px-2 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <FileUpload onUploadComplete={handleImageUpload} />

              {formData.images.length === 1 && (
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  <span>💡</span> Add another image to enable carousel navigation
                </p>
              )}
            </div>

            {/* Product Videos Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Videos (max 5 seconds) {formData.videos.length > 0 && `(${formData.videos.length})`}
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Optional: Add short product videos (5 seconds max)
              </p>

              {/* Preview uploaded videos */}
              {formData.videos.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-3">
                  {formData.videos.map((url, index) => (
                    <div key={index} className="relative group glass-card rounded-lg overflow-hidden">
                      <video
                        src={url}
                        className="w-full h-32 object-cover"
                        controls
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedVideo(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-all shadow-lg"
                        title="Delete video"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-1 left-1 glass-interactive text-white text-xs px-2 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <VideoUpload onUploadComplete={handleVideoUpload} />
            </div>

            {/* Product Details */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setFormErrors(prev => ({ ...prev, name: '' }))
                }}
                required
                className={`w-full glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${formErrors.name ? 'ring-2 ring-red-500' : 'focus:ring-primary/50'
                  }`}
                placeholder="e.g., Premium Black Abaya"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value })
                  setFormErrors(prev => ({ ...prev, description: '' }))
                }}
                required
                className={`w-full glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${formErrors.description ? 'ring-2 ring-red-500' : 'focus:ring-primary/50'
                  }`}
                placeholder="Product description"
                rows={3}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full glass-interactive rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option>Abaya</option>
                  <option>Jalabia</option>
                  <option>Hijab</option>
                  <option>Caps</option>
                  <option>Mat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price (₦)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value })
                    setFormErrors(prev => ({ ...prev, price: '' }))
                  }}
                  required
                  className={`w-full glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${formErrors.price ? 'ring-2 ring-red-500' : 'focus:ring-primary/50'
                    }`}
                  placeholder="0"
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                )}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Key Features (minimum 2)
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="mb-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        updateFeature(index, e.target.value)
                        setFormErrors(prev => {
                          const newFeatures = [...prev.features]
                          newFeatures[index] = ''
                          return { ...prev, features: newFeatures }
                        })
                      }}
                      required={index < 2}
                      className={`flex-1 glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${formErrors.features[index] ? 'ring-2 ring-red-500' : 'focus:ring-primary/50'
                        }`}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:opacity-90"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {formErrors.features[index] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.features[index]}</p>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-primary hover:underline"
              >
                + Add another feature
              </button>
            </div>

            <button
              type="submit"
              className="glow-blue w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90"
            >
              {editingProduct ? 'Update Product' : 'Upload Product'}
            </button>
          </form>
        </div>
      )}
      {/* Products Table */}
      <div className="glass-card rounded-lg overflow-hidden border border-white/10">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No products yet. Add your first product!</div>
        ) : (
          <div className="overflow-x-auto scrollbar-glass">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 backdrop-blur-sm bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Product Title</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-foreground">{product.name}</td>
                    <td className="px-4 py-3 text-foreground">{product.category}</td>
                    <td className="px-4 py-3 text-foreground">₦{product.price.toLocaleString()}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="glow-blue p-2 rounded-lg glass-interactive text-foreground transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="glow-blue p-2 rounded-lg glass-interactive text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 glass-strong rounded-lg p-4 border-l-4 animate-in slide-in-from-right duration-300 ${toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
          }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <p className="text-foreground font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard