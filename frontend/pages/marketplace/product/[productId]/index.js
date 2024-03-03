import React, { useEffect, useState } from 'react'
import Header from '@components/marketplace/header'
import NumberFormat from 'react-number-format'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
// import { addToBasket } from "../../slices/basketSlice";
// import NotFound from "../404";
// import { addToWishlist } from "../../slices/wishlistSlice";
import ProductCard from '@components/marketplace/productcard'
import Head from 'next/head'
import useCustomToast from '@/hooks/useCustomToast'
import is from 'sharp/lib/is'
import Rating from '@components/rating'
import SetRating from '@components/marketplace/SetRating'
import { set } from 'react-nprogress'
import BaseLayout from '@components/BaseLayout'
import { data } from 'autoprefixer'
import Router from 'next/router'

export default function Product({
  productId,
  dataItem,
  dataImages,
  dataFeatures,
  dataTags,
  cookie,
}) {
  const [selectedSize, setSelectedSize] = useState(0)
  // const dispatch = useDispatch();
  const [imgSelected, setImgSelected] = useState(0)
  const [owner, setOwner] = useState('')
  const showToast = useCustomToast()

  // if (!dataItem) return <NotFound />
  const [isAdded, setIsAdded] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userRated, setUserRated] = useState(false)
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)
  const [user, setUser] = useState(null)

  // State to manage the local stock quantity before saving
  const [stockQuantity, setStockQuantity] = useState(
    dataItem?.availableQuantity || 0
  )

  // Increment stock quantity
  const incrementStock = () => {
    setStockQuantity((prevQuantity) => prevQuantity + 1)
  }

  // Decrement stock quantity
  const decrementStock = () => {
    if (stockQuantity > 0) {
      setStockQuantity((prevQuantity) => prevQuantity - 1)
    }
  }

  // Handle direct input change
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0) {
      setStockQuantity(value)
    } else {
      setStockQuantity(0)
    }
  }

  const handleDeleteClick = async () => {
    const response = await fetch(
      `http://localhost:4000/v1/marketplace/product/${productId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        credentials: 'include',
      }
    ).then((res) => res.json())

    if (response.ok) {
      showToast('Product deleted successfully', 'success')
    } else {
      showToast('Failed to delete product', 'error')
    }

    // Redirect to the marketplace
    window.location.href = '/marketplace/shop'
  }

  const handleEditClick = () => {
    // Redirect to the edit page
    // window.location.href = `/marketplace/product/${productId}/edit`
    Router.push(`/marketplace/product/${productId}/edit`)
  }

  // Save the updated stock to the database (implementation depends on your backend)
  const saveStockChange = () => {
    const updateQuantity = async () => {
      const response = await fetch(
        `http://localhost:4000/v1/marketplace/product/${productId}/quantity`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            quantity: stockQuantity,
          }),
        }
      ).then((res) => res.json())

      if (response.ok) {
        showToast('Stock quantity updated successfully', 'success')
      } else {
        showToast('Failed to update stock quantity', 'error')
      }
    }
    updateQuantity()
  }

  useEffect(() => {
    const getUserRating = async () => {
      const response = await fetch(
        `http://localhost:4000/v1/marketplace/product/${productId}/rating`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      ).then((res) => res.json())
      // console.log('response', response)
      if (!response.userRating) {
        setUserRated(false)
        setUserRating(0)
        setAvgRating(response.avgRating)
        setRatingCount(response.totalRatings)
        setReviewCount(dataItem?.reviewCount)
      } else {
        // console.log('response.userRating', response.userRating)
        setUserRated(true)
        setUserRating(response.userRating)
        setAvgRating(response.avgRating)
        setRatingCount(response.totalRatings)
        setReviewCount(dataItem?.reviewCount)
      }

      const responseWishlist = await fetch(
        `http://localhost:4000/v1/marketplace/product/${productId}/wishlist`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      ).then((res) => res.json())

      if (responseWishlist.inWishlist) {
        setIsAdded(true)
      }

      const loggedIn = await fetch(`http://localhost:4000/v1/auth/isLoggedIn`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        credentials: 'include',
      }).then((res) => res.json())

      if (loggedIn) {
        setUser(loggedIn.user)
      }
      // console.log('loggedIn', loggedIn)
      // console.log('userInfo', userInfo)
    }

    const getOwner = async (ownerId) => {
      const response = await fetch(
        `http://localhost:4000/v1/profile/${ownerId}/profile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        // console.log('data.profileInfo', data.profileInfo)
        setOwner(data.profileInfo.username)
        return data.profileInfo
      }

      return null
    }

    getOwner(dataItem?.owner.id)
    getUserRating()
    // console.log('userRated', userRated, 'userRating', userRating)
  }, [userRating, avgRating, reviewCount, isAdded])

  const handleClick = () => {
    try {
      const response = fetch(
        `http://localhost:4000/v1/marketplace/product/${productId}/wishlist`,
        {
          method: isAdded ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      ).then((res) => res.json())
      setIsAdded(!isAdded)
    } catch (err) {
      console.log(err)
    }
  }

  const handleContact = () => {
    Router.push(`/chat/${owner}`)
  }

  const handleRating = (rate) => {
    // console.log(`Rated with: ${rate}`)

    try {
      const response = fetch(
        `http://localhost:4000/v1/marketplace/product/${productId}/rating`,
        {
          method: userRated ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            rating: parseInt(rate),
          }),
        }
      ).then((res) => res.json())
      setUserRating(rate)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Head>
        <title>{dataItem?.productName}</title>
      </Head>

      <div className="bg-cusgray min-h-screen pb-10">
        <Header />
        <div className="py-10">
          <BaseLayout>
            <div className="max-w-4xl mx-auto min-h-screen pt-16">
              <div className="flex justify-between place-items-center py-4 px-1 mb-4">
                <Link href="/marketplace/shop">
                  <div className="w-9 h-9 shadow-lg bg-white text-cusblack hover:bg-primary-600 hover:text-white duration-200 cursor-pointer rounded-full flex justify-center place-items-center">
                    <svg
                      className="w-4 h-4 "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                </Link>
                <h4 className="text-cusblack text-md">Product Details</h4>
                <div className="w-8"></div>
              </div>

              <div className="w-full bg-black md:rounded-2xl shadow-lg md:py-8 md:px-10 md:flex overflow-hidden">
                <div className="photo md:w-1/3">
                  <div>
                    <img
                      className=" h-90 object-cover w-full md:rounded-2xl"
                      src={dataImages[imgSelected]?.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="px-2 md:px-0 flex mt-4">
                    {dataImages?.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.imageUrl}
                        onClick={() => setImgSelected(idx)}
                        className={`${
                          imgSelected == idx
                            ? `border-2 border-cusblack filter brightness-90 `
                            : ``
                        } md:w-14 md:h-14 h-16 w-16 rounded-xl object-cover mr-3 cursor-pointer duration-100 `}
                        alt=""
                      />
                    ))}
                  </div>
                </div>
                <div className="detail px-2 md:px-0 mt-3 md:mt-0 md:ml-6 py-2 md:w-2/3">
                  <p className="flex place-items-center text-sm text-gray-400">
                    {dataItem?.movie.title}
                    <span className="mx-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {dataItem?.category}
                  </p>
                  <h1 className="text-3xl text-cusblack font-medium my-3">
                    {dataItem?.productName}
                  </h1>

                  {user && dataItem?.owner.id !== user?.id && (
                    <SetRating
                      onRating={handleRating}
                      defaultRating={userRating}
                      count={ratingCount}
                    />
                  )}

                  <div className="flex items-center pb-4">
                    <Rating className="pb-5" average={avgRating} />
                    <p className="pb-4 px-10 text-base text-gray-400">
                      | {reviewCount} Customer Reviews{' '}
                    </p>
                  </div>

                  <p className="py-2 text-base text-gray-400">Designed By </p>
                  <Link href={`/profile/${owner}`} passHref>
                    <p className="font-semibold text-lg text-cusblack pb-4">
                      {owner}
                    </p>
                  </Link>

                  <p className="py-2 text-base text-gray-400">Price:</p>
                  <div className="flex items-center pb-4">
                    <p className="font-semibold text-lg text-cusblack">
                      Tk {dataItem?.price}
                    </p>
                    <div
                      className={`ml-10 font-semibold text-base ${
                        stockQuantity > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                    <div className="px-10">
                      {user && dataItem?.owner.id === user?.id && (
                        <div className="flex items-center ml-4">
                          <button
                            onClick={decrementStock}
                            className="px-2 py-1 text-lg text-black-100 font-semibold bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="w-16 text-black-100 text-center mx-2 border rounded"
                            value={stockQuantity}
                            onChange={handleInputChange}
                          />
                          <button
                            onClick={incrementStock}
                            className="px-2 py-1 text-lg text-black-100 font-semibold bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={saveStockChange}
                            className="ml-2 px-2 py-1 bg-primary-600 text-black-100 rounded hover:bg-primary-700"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="py-2 text-base text-gray-400">Tags:</p>
                  <div className="flex flex-wrap gap-2 pb-4">
                    {dataTags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-sm text-black-100 bg-primary-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="py-2 text-base text-gray-400">Colors:</p>
                  <div className="flex flex-wrap gap-2 pb-4">
                    {dataItem.colors?.map((color, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-sm text-black-100 bg-primary-600 rounded-full"
                      >
                        {color}
                      </span>
                    ))}
                  </div>

                  <p className="py-2 text-base text-gray-400">
                    Product Features:
                  </p>
                  <ul className="list-disc pl-5 pb-4">
                    {dataFeatures?.map((feature, index) => (
                      <li
                        key={index}
                        className="font-normal text-base text-cusblack"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {dataItem?.sizes && (
                    <div className="sizes text-base text-gray-400">
                      <p className="mb-2">Sizes</p>
                      <div className="flex">
                        {dataItem.sizes?.map((size, idx) => (
                          <button
                            onClick={() => setSelectedSize(idx)}
                            key={idx}
                            className={`${
                              selectedSize === idx
                                ? `bg-cusblack text-white`
                                : `text-cusblack border border-cusblack`
                            } mr-2 duration-200 flex place-items-center justify-center rounded-full w-12 h-12 cursor-pointer hover:bg-cusblack hover:text-white`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="buttoncart flex mt-5 w-full">
                    {user && dataItem?.owner.id !== user?.id && (
                      <button
                        onClick={handleClick}
                        className="mr-2 w-4/5 md:w-3/5 bg-primary-600 overflow-hidden py-4 text-black-100 rounded-lg text-sm active:bg-primary-900 duration-100 hover:bg-primary-700"
                      >
                        <motion.span
                          initial={{ y: -100 }}
                          animate={{ y: 0 }}
                          className="flex justify-center place-items-center overflow-hidden"
                        >
                          {isAdded ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          <span>
                            <svg
                              className="ml-2 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                          </span>
                        </motion.span>
                      </button>
                    )}

                    {user && dataItem?.owner.id !== user?.id && (
                      <button
                        onClick={handleContact}
                        className="mr-2 w-4/5 md:w-3/5 bg-primary-600 overflow-hidden py-4 text-black-100 rounded-lg text-sm active:bg-primary-900 duration-100 hover:bg-primary-700"
                      >
                        <motion.span
                          initial={{ y: -100 }}
                          animate={{ y: 0 }}
                          className="flex justify-center place-items-center overflow-hidden"
                        >
                          {'Contact '}
                          <span>
                            <svg
                              className="ml-2 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 3a4 4 0 100 8 4 4 0 000-8zM2 16a2 2 0 012-2h12a2 2 0 012 2v1H2v-1z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </span>
                        </motion.span>
                      </button>
                    )}

                    {user && dataItem?.owner.id === user?.id && (
                      <button
                        onClick={handleEditClick}
                        className="mr-2 w-4/5 md:w-3/5 bg-primary-600 overflow-hidden py-4 text-black-100 rounded-lg text-sm active:bg-primary-900 duration-100 hover:bg-primary-700"
                      >
                        <motion.span
                          initial={{ y: -100 }}
                          animate={{ y: 0 }}
                          className="flex justify-center items-center overflow-hidden"
                        >
                          Edit Item
                          <span>
                            <svg
                              className="ml-2 w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L12 21H3v-9l10.232-10.232z"
                              />
                            </svg>
                          </span>
                        </motion.span>
                      </button>
                    )}

                    {user && dataItem?.owner.id === user?.id && (
                      <button
                        onClick={handleDeleteClick}
                        className="mr-2 w-4/5 md:w-3/5 bg-red-600 overflow-hidden py-4 text-black-100 rounded-lg text-sm active:bg-red-900 duration-100 hover:bg-red-700"
                      >
                        <motion.span
                          initial={{ y: -100 }}
                          animate={{ y: 0 }}
                          className="flex justify-center items-center overflow-hidden"
                        >
                          Delete Item
                          <span>
                            <svg
                              className="ml-2 w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </span>
                        </motion.span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* <div className="text-cusblack p-2 md:px-10 md:py-6 mt-14 bg-white md:rounded-2xl shadow-lg">
            <p className="mb-4 font-medium text-lg">You may also like:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-4 gap-y-6">
              {dataAlso
                .filter((it, idx) => it.name != dataItem.name)
                .map((data, idx) => {
                  if (idx < 4)
                    return <ProductCard key={data.slug} item={data} />;
                })}
            </div>
          </div> */}
            </div>
          </BaseLayout>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  // const cookie = context.req.headers.cookie

  // Helper function to fetch data
  async function fetchData(url, params) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // ...(cookie ? { Cookie: cookie } : {}),
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

  const cookie = ''

  const dataItem = await fetchData(
    `http://localhost:4000/v1/marketplace/product/${productId}`
  )

  const dataImages = await fetchData(
    `http://localhost:4000/v1/marketplace/product/${productId}/images`
  )
  const dataFeatures = await fetchData(
    `http://localhost:4000/v1/marketplace/product/${productId}/features`
  )
  const dataTags = await fetchData(
    `http://localhost:4000/v1/marketplace/product/${productId}/tags`
  )

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
