import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@styles/Form.module.css'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import Head from 'next/head'
import Search from '@components/marketplace/movieSearch'

import supabase from '../../../utils/supabaseClient'

function ProductUpload() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    sizes: [],
    colors: [],
    availableQty: '',
    thumbnailUrl: '',
    movieId: '',
    tags: [],
    features: [],
    images: [],
  })
  const router = useRouter()

  const [colorInput, setColorInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  const [sizeInput, setSizeInput] = useState('')

  const [movieId, setMovieId] = useState('')

  const [thumbnailFile, setThumbnailFile] = useState(null)

  const handleMovieSelect = (movieId) => {
    setMovieId(movieId)
    setProduct({ ...product, movieId })

    console.log('movieId', movieId)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (['sizes', 'colors', 'tags', 'features'].includes(name)) {
      setProduct({ ...product, [name]: value.split(',') }) // Split by comma for arrays
    } else if (name === 'images') {
      setProduct({ ...product, images: [...e.target.files] }) // Handle multiple files
    } else {
      setProduct({ ...product, [name]: value })
    }
  }

  const handleColorSubmit = (e) => {
    e.preventDefault() // Prevent form submission
    if (colorInput && !product.colors.includes(colorInput)) {
      setProduct({ ...product, colors: [...product.colors, colorInput] })
      setColorInput('') // Reset input
    }
  }

  const handleTagSubmit = (e) => {
    e.preventDefault()
    if (tagInput && !product.tags.includes(tagInput)) {
      setProduct({ ...product, tags: [...product.tags, tagInput] })
      setTags([...tags, tagInput])
      setTagInput('')
    }
  }

  const handleSizeSubmit = (e) => {
    e.preventDefault() // Prevent form submission
    if (sizeInput && !product.sizes.includes(sizeInput)) {
      setProduct({ ...product, sizes: [...product.sizes, sizeInput] })
      setSizeInput('') // Reset input
    }
  }

  const handleThumbnailFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setThumbnailFile(file) // Store the file in state for later
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if at least one tag is added
    if (tags.length === 0) {
      alert('Please add at least one tag.')
      return
    }

    const formData = new FormData()
    Object.keys(product).forEach((key) => {
      if (['sizes', 'colors', 'tags', 'features'].includes(key)) {
        product[key].forEach((item) => formData.append(key + '[]', item))
      } else if (key === 'images') {
        product.images.forEach((image, index) =>
          formData.append(`images[${index}]`, image)
        )
      } else {
        formData.append(key, product[key])
      }
    })

    // Upload thumbnail image
    if (thumbnailFile) {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const filePath = `public/${product.movieId}/${uniquePrefix}-${thumbnailFile.name}`

      // console.log('filePath:', filePath)
      // console.log('selectedFile:', selectedFile)

      const { data: uploadData, error } = await supabase.storage
        .from('marketplace')
        .upload(filePath, thumbnailFile)

      if (error) {
        console.error('Error uploading file:', error)
        throw error
      }

      // console.log('uploadData', uploadData)

      // Assuming you have the URL, update your DB or state as necessary
      const { data: publicURL } = supabase.storage
        .from('marketplace')
        .getPublicUrl(filePath)
      // console.log('File uploaded:', publicURL)
      // Here you can proceed to update the user profile or perform other actions with the form data
      product.thumbnailUrl = publicURL.publicUrl
    }

    const newImages = []

    // Upload new images
    if (product.images.length > 0) {
      for (let file of product.images) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filePath = `public/${product.movieId}/${uniquePrefix}-${file.name}`
        const { data: uploadData, error } = await supabase.storage
          .from('marketplace')
          .upload(filePath, file)

        if (error) {
          console.error('Error uploading file:', file.name, error)
          throw error
        }

        const { data: publicURL } = supabase.storage
          .from('marketplace')
          .getPublicUrl(filePath)

        newImages.push({
          imageUrl: publicURL.publicUrl,
          caption: '',
        })
      }
      product.images = newImages
    }

    try {
      // console.log('product', product)

      const response = await fetch(
        'http://localhost:4000/v1/marketplace/product',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(product),
        }
      )

      if (response.ok) {
        const { productId } = await response.json()
        router.push(`/marketplace/product/${productId}`)
      } else {
        console.error('Failed to upload product')
      }
    } catch (error) {
      console.error('Error uploading product:', error)
    }
  }

  return (
    <div>
      <Head>
        <title>Marketplace &mdash; CineConnect</title>
        <meta
          name="description"
          content="Millions of movies, TV shows and people to discover. Explore now."
        />
        <meta
          name="keywords"
          content="where can i watch, movie, movies, tv, tv shows, cinema, movielister, movie list, list"
        />

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <Navbar />
      <BaseLayout>
        <div className="max-w-xl mx-auto my-10">
          <h1 className="text-2xl font-bold mb-6">Upload Your Own Product</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <label>
              Name
              <input
                type="text"
                name="name"
                required
                value={product.name}
                onChange={handleChange}
                className="input my-5"
              />
            </label>
            <label>
              Price
              <input
                type="number"
                name="price"
                required
                value={product.price}
                onChange={handleChange}
                className="input my-5"
              />
            </label>
            <label>
              Category
              <input
                type="text"
                name="category"
                required
                value={product.category}
                onChange={handleChange}
                className="input my-5"
              />
            </label>
            <label>
              Colors
              <div className="relative">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Add a color"
                  className="input my-5"
                />
                {/* </label> */}
                <button
                  type="button"
                  onClick={handleColorSubmit}
                  className="absolute inset-y-0 right-0 px-4 py-2 my-5 text-black-100 bg-primary-600 rounded-r"
                >
                  Add
                </button>
              </div>
            </label>

            {/* Displaying added colors as buttons */}
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, index) => (
                <span
                  key={index}
                  className="px-4 py-2 text-black-100 bg-primary-600 rounded-full"
                >
                  {color}
                </span>
              ))}
            </div>

            <label>
              Tags
              <div className="relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="input my-5"
                />
                {/* </label> */}
                <button
                  type="button"
                  onClick={handleTagSubmit}
                  className="absolute inset-y-0 right-0 px-4 py-2 my-5 text-black-100 bg-primary-600 rounded-r"
                >
                  Add
                </button>
              </div>
            </label>

            {/* Displaying added colors as buttons */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 text-black-100 bg-primary-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <label>
              Size
              <div className="relative">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="Add a size"
                  className="input my-5"
                />
                {/* </label> */}
                <button
                  type="button"
                  onClick={handleSizeSubmit}
                  className="absolute inset-y-0 right-0 px-4 py-2 my-5 text-black-100 bg-primary-600 rounded-r"
                >
                  Add
                </button>
              </div>
            </label>

            {/* Displaying added colors as buttons */}
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => (
                <span
                  key={index}
                  className="px-4 py-2 text-black-100 bg-primary-600 rounded-full"
                >
                  {size}
                </span>
              ))}
            </div>

            <label>
              Available Quantity
              <input
                type="number"
                name="availableQty"
                required
                value={product.availableQty}
                onChange={handleChange}
                className="input my-5"
              />
            </label>
            <label>
              Thumbnail
              <input
                type="file"
                accept="image/jpeg, image/png"
                required
                onChange={handleThumbnailFileChange}
                className="input my-5"
              />
            </label>
            <label>
              Movie
              <Search onMovieSelect={handleMovieSelect} />
            </label>
            {/* <label>
          Tags
          <input
            type="text"
            name="tags"
            placeholder="Separate tags with commas"
            onChange={handleChange}
            className="input"
          />
        </label> */}
            <label>
              Features
              <input
                type="text"
                name="features"
                required
                placeholder="Separate features with commas"
                onChange={handleChange}
                className="input my-5"
              />
            </label>
            <label>
              Images
              <input
                type="file"
                name="images"
                accept="image/jpeg, image/png"
                multiple
                onChange={handleChange}
                className="input my-5"
              />
            </label>
            <button className={`${styles.btn}`} type="submit">
              Upload Product
            </button>
          </form>
        </div>
      </BaseLayout>
    </div>
  )
}

export default ProductUpload
