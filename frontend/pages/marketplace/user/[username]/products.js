import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '@/components/marketplace/header'
import Product from '@/components/marketplace/productown'
import Head from 'next/head'
import Pagination from '@components/pagination'

function ProductList({ username, cookie, offset, totalProducts, currentPage }) {
  // const data = useSelector(selectWishItems);
  const [items, setItems] = useState([])
  const limit = 9
  const totalPages = Math.ceil(totalProducts.count / (limit || 1))

  const fetchProductlist = async () => {
    const response = await fetch(
      `http://localhost:4000/v1/marketplace/user/${username}/products?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    if (!response.ok) {
      throw new Error('Something went wrong')
    }

    const data = await response.json()

    setItems(data)
  }

  useEffect(() => {
    fetchProductlist()
  }, [])

  const handleRemoveFromProductlist = (id) => {
    // removeFromWishlist(id).then(() => {
    fetchProductlist()
    // });
  }

  return (
    <>
      <Head>
        <title>CineConnect | Productlist</title>
      </Head>
      <div className="w-full min-h-screen relative bg-cusgray pb-10">
        <Header />
        <div className="max-w-6xl mx-auto pt-20 px-5 min-h-screen">
          <div className="bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 md:py-6 md:px-6 pb-3">
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 px-4 md:px-0">
              {/* {console.log('items', items.length)} */}
              {items ? (
                items?.map((item, idx) => (
                  <Product
                    item={item}
                    key={item.id}
                    idx={idx}
                    onRemove={handleRemoveFromProductlist}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-400 col-span-2 md:col-span-3 lg:col-span-4 flex justify-center place-items-center">
                  Your productlist is empty
                </div>
              )}
            </div>

            <div className="overflow-hidden md:pl-10 row-start-1 md:col-start-3 mb-6 md:mb-0 h-48 md:h-full">
              <div className="relative">
                <div className="text-primary-600 flex justify-center place-items-center text-2xl absolute w-full rounded-xl bg-gray-600 ml-10 bg-opacity-60 font-bold right-0 top-0 h-48 md:h-full">
                  <h1>PRODUCT LIST</h1>
                </div>
                <img
                  src="https://i.pinimg.com/originals/84/d8/2d/84d82d33c5cc2a0dcb9dfe87e8666702.gif"
                  className="object-cover rounded-xl w-full"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          className="mt-8"
        />
      </div>
    </>
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

  // const productId = context.params.productId

  const user = await fetchData('http://localhost:4000/v1/auth/isLoggedIn')

  // console.log('user', user)

  const username = user.user.username

  const offset = (context.query.page - 1) * 9 || 0

  const totalProducts = await fetchData(
    `http://localhost:4000/v1/marketplace/user/${username}/products/count`
  )

  const currentPage = context.query.page || 1

  return {
    props: {
      username,
      cookie,
      offset,
      totalProducts,
      currentPage,
    },
  }
}

export default ProductList
