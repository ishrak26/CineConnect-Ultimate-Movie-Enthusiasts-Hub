import React, { useState } from 'react'
// import { useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import CardSkeleton from '@/components/marketplace/cardskeleton'
import Layout from '@/components/marketplace/layout'
import MovieCard from '@/components/marketplace/moviecard'
// import { recentCategory } from '../../slices/categorySlice'
import Head from 'next/head'
// import useCustomToast from '@/hooks/useCustomToast'
import Pagination from '@components/pagination'
// import { tr } from 'date-fns/locale'

function Category({
  data,
  dataItems,
  dataTypes,
  totalPages,
  // cookie,
  currentPage,
}) {
  const [sort, setSort] = useState(0)
  // const showToast = useCustomToast()
  // const [tag, setTag] = useState('')

  const data_items = dataItems
    // .filter((item) => {
    //   if (recent_category.length > 0) {
    //     return item.type.name == recent_category
    //   } else {
    //     return true
    //   }
    // })
    .sort((a, b) => {
      if (sort === 2) {
        return a.price - b.price
      }
      if (sort === 3) {
        return b.price - a.price
      }
      return true
    })

  return (
    <>
      <Head>
        <title>CineConnect | Shop</title>
      </Head>
      {}
      <div
        style={{ display: 'flex', flexDirection: 'column', minHeight: '250vh' }}
      >
        <div style={{ flex: 1 }} className="my-10">
          <Layout
            categories={data}
            setSort={setSort}
            types={dataTypes}
            setTag={setTag}
            isHome={true}
          >
            {data_items ? (
              data_items.map((item) => <MovieCard key={item.id} item={item} />)
            ) : (
              <p className="col-span-full mx-auto my-10 text-sm text-gray-400">
                No item found
              </p>
            )}
          </Layout>
        </div>
        <div className="my-20">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            className="mt-20"
          />
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

  const limit = 12
  const offset = (context.query.page - 1) * limit || 0

  const dataItems = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/movies?limit=${limit}&offset=${offset}`
  )

  const totalItems = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/movies/count`
  )

  const data = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/tags`
  )
  const dataTypes = data

  const currentPage = context.query.page || 1
  const totalPages = Math.ceil(totalItems.count / limit)

  return {
    props: {
      data,
      dataItems,
      dataTypes,
      totalPages,
      // cookie,
      currentPage,
    },
  }
}

export default Category
