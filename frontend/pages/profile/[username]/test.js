import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@styles/Form.module.css'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import Head from 'next/head'

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
  const [sizeInput, setSizeInput] = useState('')

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

  // const handleTagSubmit = (e) => {
  //   e.preventDefault() // Prevent form submission
  //   if (tagInput && !product.tags.includes(tagInput)) {
  //     setProduct({ ...product, tags: [...product.tags, tagInput] })
  //     setTagInput('') // Reset input
  //   }
  // }

  const handleSizeSubmit = (e) => {
    e.preventDefault() // Prevent form submission
    if (sizeInput && !product.sizes.includes(sizeInput)) {
      setProduct({ ...product, sizes: [...product.sizes, sizeInput] })
      setSizeInput('') // Reset input
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(product).forEach((key) => {
      if (['sizes', 'colors', 'tags', 'features'].includes(key)) {
        product[key].forEach((item) => formData.append(key + '[]', item))
      } else if (key === 'images') {
        product.images.forEach((image, index) =>
          formData.append(product.images[`${index}`], image)
        )
      } else {
        formData.append(key, product[key])
      }
    })

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { productId } = await response.json()
        router.push(`/marketplace/product/${productId}`)
      } else {
        // console.error('Failed to upload product')
      }
    } catch (error) {
      // console.error('Error uploading product:', error)
    }
  }

  return (
    <div>
      <Head>
        <title>Forums &mdash; CineConnect</title>
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
                value={product.name}
                onChange={handleChange}
                className="input"
              />
            </label>
            <label>
              Price
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="input"
              />
            </label>
            <label>
              Category
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="input"
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
                  className="input"
                />
                {/* </label> */}
                <button
                  type="button"
                  onClick={handleColorSubmit}
                  className="absolute inset-y-0 right-0 px-4 py-2 text-black-100 bg-primary-600 rounded-r"
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
                  className="input"
                />
                {/* </label> */}
                <button
                  type="button"
                  onClick={handleColorSubmit}
                  className="absolute inset-y-0 right-0 px-4 py-2 text-black-100 bg-primary-600 rounded-r"
                >
                  Add
                </button>
              </div>
            </label>

            {/* Displaying added colors as buttons */}
            <div className="flex flex-wrap gap-2">
              {product.colors.map((tag, index) => (
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
                  className="input"
                />
                {/* </label> */}
                <button
                  type="button"
                  onClick={handleSizeSubmit}
                  className="absolute inset-y-0 right-0 px-4 py-2 text-black-100 bg-primary-600 rounded-r"
                >
                  Add
                </button>
              </div>
            </label>

            {/* Displaying added colors as buttons */}
            <div className="flex flex-wrap gap-2">
              {product.colors.map((size, index) => (
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
                value={product.availableQty}
                onChange={handleChange}
                className="input"
              />
            </label>
            <label>
              Thumbnail URL
              <input
                type="text"
                name="thumbnailUrl"
                value={product.thumbnailUrl}
                onChange={handleChange}
                className="input"
              />
            </label>
            <label>
              Movie ID
              <input
                type="text"
                name="movieId"
                value={product.movieId}
                onChange={handleChange}
                className="input"
              />
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
                placeholder="Separate features with commas"
                onChange={handleChange}
                className="input"
              />
            </label>
            <label>
              Images
              <input
                type="file"
                name="images"
                multiple
                onChange={handleChange}
                className="input"
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
