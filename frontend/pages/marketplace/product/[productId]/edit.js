import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@styles/Form.module.css'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import Head from 'next/head'
import Search from '@components/marketplace/movieSearch'
// import { set } from 'react-nprogress'

import supabase from '../../../../utils/supabaseClient'

function ProductEdit({
  productId,
  dataItem,
  dataImages,
  dataFeatures,
  dataTags,
  // cookie,
}) {
  const [product, setProduct] = useState({
    name: dataItem.productName || '',
    price: dataItem.price || '',
    category: dataItem.category || '',
    sizes: dataItem.sizes || [],
    colors: dataItem.colors || [],
    availableQty: dataItem.availableQuantity || '',
    thumbnailUrl: dataItem.thumbnailUrl || '',
    movieId: dataItem.movie.id || '',
    tags: dataTags || [],
    features: dataFeatures || [],
    images: dataImages || [],
  })

  const router = useRouter()

  const [colorInput, setColorInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')

  // const [movieId, setMovieId] = useState('')

  //   const [newImages, setNewImages] = useState([])
  const [existingImages, setExistingImages] = useState(dataImages)
  const [files, setFiles] = useState([])
  const [thumbnailFile, setThumbnailFile] = useState(null)

  useEffect(() => {
    setExistingImages(dataImages)
  }, [productId])

  // Handle file selection
  const handleFileChange = (event) => {
    // Create an array from the FileList
    const newFiles = Array.from(event.target.files)
    // Append new files to the existing list
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    // Clear the input after each selection
    event.target.value = null
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // Handle existing image deletion
  const handleDeleteExistingImage = (image) => {
    setExistingImages(existingImages.filter((img) => img !== image))
  }

  const handleMovieSelect = (movieId) => {
    // setMovieId(movieId)
    setProduct({ ...product, movieId })

    // console.log('movieId', movieId)
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
    e.preventDefault() // Prevent form submission
    if (tagInput && !product.tags.includes(tagInput)) {
      setProduct({ ...product, tags: [...product.tags, tagInput] })
      setTagInput('') // Reset input
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

  const [shouldCallAPI, setShouldCallAPI] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare new images array
    const newImages = existingImages.map((image) => ({
      imageUrl: image.imageUrl,
      caption: image.caption,
    }))

    // console.log('newImages', newImages)

    // Upload thumbnail image
    if (thumbnailFile) {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const filePath = `public/${product.movieId}/${uniquePrefix}-${thumbnailFile.name}`

      // console.log('filePath:', filePath)
      // console.log('selectedFile:', selectedFile)

      const { error } = await supabase.storage
        .from('marketplace')
        .upload(filePath, thumbnailFile)
      // const { data: uploadData, error } = await supabase.storage
      //   .from('marketplace')
      //   .upload(filePath, thumbnailFile)

      if (error) {
        // console.error('Error uploading file:', error)
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

    // console.log('files.length', files.length)

    // Upload new images
    if (files.length > 0) {
      for (let file of files) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filePath = `public/${product.movieId}/${uniquePrefix}-${file.name}`
        const { error } = await supabase.storage
          .from('marketplace')
          .upload(filePath, file)
        // const { data: uploadData, error } = await supabase.storage
        //   .from('marketplace')
        //   .upload(filePath, file)

        if (error) {
          // console.error('Error uploading file:', file.name, error)
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
    }

    // Update product state with new images
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: newImages,
    }))

    // Indicate that we're ready to make the API call
    setShouldCallAPI(true)
  }

  useEffect(() => {
    if (!shouldCallAPI) return

    const makeAPICall = async () => {
      const formData = new FormData()

      Object.keys(product).forEach((key) => {
        if (['sizes', 'colors', 'tags', 'features'].includes(key)) {
          product[key].forEach((item) => formData.append(`${key}[]`, item))
        } else if (key !== 'images') {
          formData.append(key, product[key])
        }
      })

      product.images.forEach((image, index) => {
        formData.append(`images[${index}][imageUrl]`, image.imageUrl)
        formData.append(`images[${index}][caption]`, image.caption)
      })

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/product/${productId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(product),
          }
        )

        if (response.ok) {
          router.push(`/marketplace/product/${productId}`)
        } else {
          // console.error('Failed to upload product')
        }
      } catch (error) {
        // console.error('Error uploading product:', error)
      }

      setShouldCallAPI(false)
    }

    makeAPICall()
  }, [shouldCallAPI, product, productId])

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
                required={!product.thumbnailUrl}
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
                placeholder="Separate features with commas"
                onChange={handleChange}
                className="input my-5"
              />
            </label>
            {/* <label>
              Images
              <input
                type="file"
                name="images"
                multiple
                onChange={handleChange}
                className="input my-5"
              />
            </label> */}
            <div>
              <h2 className="my-5">Existing Images</h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {existingImages.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={image.imageUrl}
                      className="pb-2"
                      alt={`Existing product`}
                      style={{ width: '110px', height: '150px' }}
                    />
                    <button
                      className="text-black-100 bg-primary-600 border border-cusblack py-2 text-xs w-24 rounded-lg"
                      onClick={() => handleDeleteExistingImage(image)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="my-5">Upload New Images</h3>
              <input
                type="file"
                accept="image/jpeg, image/png"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {files.map((file, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    onLoad={() => URL.revokeObjectURL(file)} // Revoke URL to free memory
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                  <div>{file.name}</div>
                  <button
                    className="text-black-100 bg-primary-600 border border-cusblack py-2 text-xs w-24 rounded-lg"
                    onClick={() => {
                      URL.revokeObjectURL(file) // Revoke URL to free memory when file is removed
                      removeFile(index)
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button className={`${styles.btn}`} type="submit">
              Save Product
            </button>
          </form>
        </div>
      </BaseLayout>
    </div>
  )
}

export async function getServerSideProps(context) {
  const cookie = context.req.headers.cookie

  // Helper function to fetch data
  async function fetchData(url, params) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        credentials: 'include',
        ...params,
      })

      // console.log("response ", response);

      if (response.ok) {
        return await response.json()
      }
      return { error: response.statusText }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { notFound: true }
      }
      return { error: error.message }
    }
  }

  const productId = context.params.productId

  const dataItem = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/product/${productId}`
  )

  const dataImages = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/product/${productId}/images`
  )
  const dataFeatures = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/product/${productId}/features`
  )
  const dataTags = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/product/${productId}/tags`
  )

  // console.log('dataItem', dataItem)

  return {
    props: {
      productId,
      dataItem,
      dataImages,
      dataFeatures,
      dataTags,
      cookie,
    },
  }
}

export default ProductEdit
