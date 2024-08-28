import Link from 'next/link'
import React from 'react'
// import NumberFormat from 'react-number-format'
import { motion } from 'framer-motion'

function Product({ item, onRemove }) {
  const removeFromProductlist = async (id) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/product/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    if (!response.ok) {
      throw new Error('Something went wrong')
    } else {
      onRemove(id)
    }
  }

  return (
    <div className="mb-4 overflow-hidden">
      <motion.div
        initial={{ scale: 1.5, x: 100, y: -100, opacity: 0 }}
        animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
      >
        <img
          className="h-48 rounded-lg object-cover w-full"
          src={item.thumbnailUrl}
          alt=""
        />
      </motion.div>
      <div className="px-2 py-1 text-cusblack">
        <p className="text-sm line-clamp-1">{item.name}</p>

        <p className="text-xs my-1.5">Tk {item.price}</p>

        <Link href={'/marketplace/product/' + item.id}>
          <button className="text-black-100 bg-primary-600 border border-cusblack py-1 text-xs w-full rounded-lg">
            View product
          </button>
        </Link>
        <button
          onClick={() => removeFromProductlist(item.id)}
          className="text-cusblack mt-1.5 bg-white border border-cusblack py-1 text-xs w-full rounded-lg"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default Product
