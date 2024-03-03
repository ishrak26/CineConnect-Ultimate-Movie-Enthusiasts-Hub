import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '@/components/marketplace/header'
import WishProduct from '@/components/marketplace/wishproduct'
// import { selectWishItems } from "../slices/wishlistSlice";
import Head from 'next/head'

function WishList({ username, cookie, offset }) {
  // const data = useSelector(selectWishItems);
  const [items, setItems] = useState([])

  const fetchWishlist = async () => {

    const limit = 9
    const response = await fetch(
      `http://localhost:4000/v1/${username}/product/wishlist?limit=${limit}&offset=${offset}`,
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
  };

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemoveFromWishlist = (id) => {
    // removeFromWishlist(id).then(() => {
      fetchWishlist(); 
    // });
  };

  return (
    <>
      <Head>
        <title>CineConnect | Wishlist</title>
      </Head>
      <div className="w-full min-h-screen relative bg-cusgray pb-10">
        <Header />
        <div className="max-w-6xl mx-auto pt-20 px-5 min-h-screen">
          <div className="bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 md:py-6 md:px-6 pb-3">
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 px-4 md:px-0">
              {/* {console.log('items', items.length)} */}
              {items ? (
                items?.map((item, idx) => (
                  <WishProduct item={item} key={item.id} idx={idx} onRemove={handleRemoveFromWishlist} />
                ))
              ) : (
                <div className="text-sm text-gray-400 col-span-2 md:col-span-3 lg:col-span-4 flex justify-center place-items-center">
                  Your wishlist is empty
                </div>
              )}
            </div>

            <div className="overflow-hidden md:pl-10 row-start-1 md:col-start-3 mb-6 md:mb-0 h-48 md:h-full">
              <div className="relative">
                <div className="text-primary-600 flex justify-center place-items-center text-2xl absolute w-full rounded-xl bg-gray-600 ml-10 bg-opacity-60 font-bold right-0 top-0 h-48 md:h-full">
                  <h1>WISHLIST</h1>
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

  return {
    props: {
      username,
      cookie,
      offset,
    },
  }
}

export default WishList
