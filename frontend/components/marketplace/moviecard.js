import useCustomToast from '@/hooks/useCustomToast'
import React from 'react'
import Image from 'next/image'
import NumberFormat from 'react-number-format'
import { motion } from 'framer-motion'
import Router from 'next/router'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
// import { addToWishlist } from "../slices/wishlistSlice";

function MovieCard({ item }) {
  const showToast = useCustomToast()

  console.log(item)

  const handleClick = () => {
    try {
      Router.push(`/marketplace/shop/${item.id}`)
    } catch (err) {
      console.log(err)

      showToast({
        title: 'Error!',
        description: 'Failed to add to wishlist',
        status: 'error',
      })
    }
  }

  return (
    <div className="rounded-xl cursor-pointer">
      <div className="w-45 h-64 overflow-hidden cursor-default rounded-xl relative group">
        <motion.div
          initial={{ scale: 1.3, x: 50, opacity: 0 }}
          animate={{ scale: 1, x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Image
            height={700}
            width={700}
            objectFit="cover"
            loading="lazy"
            src={item.poster_url}
            alt=""
            className="rounded-xl w-45 h-62 bg-cusgray"
          />
        </motion.div>
        <div className="hidden absolute rounded-xl h-full w-full bg-gray-500 backdrop-filter backdrop-blur-sm bg-opacity-30 top-0 group group-hover:flex justify-center place-items-center z-10">
          <div className="flex overflow-hidden cursor-pointer">
            <button
              onClick={handleClick}
              className="p-2 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg"
            >
              <svg
                className="w-6 h-6 text-cusblack"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="px-2 py-2">
        <Link href={`/marketplace/shop/${item.id}`} passHref>
          <div className="cursor-pointer">
            <p className="text-sm line-clamp-1">{item.title}</p>
            <p className="text-xs my-2 text-gray-400">{item.release_date}</p>
            {/* <p className="text-sm font-semibold">Tk {item.price}</p> */}
          </div>
        </Link>
      </div>
    </div>
  )
}

export default MovieCard
