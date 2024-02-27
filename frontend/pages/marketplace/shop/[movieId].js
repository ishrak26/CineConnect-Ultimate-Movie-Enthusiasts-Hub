import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CardSkeleton from '@/components/marketplace/cardskeleton'
import Layout from '@/components/marketplace/layout'
import ProductCard from '@/components/marketplace/productcard'
// import { recentCategory } from '../../slices/categorySlice'
import Head from 'next/head'
import useCustomToast from '@/hooks/useCustomToast'
import Pagination from '@components/pagination'

function Category({
  movieId,
  data,
  dataItems,
  dataTypes,
  totalPages,
  cookie,
  currentPage,
}) {
  const [sort, setSort] = useState(0)
  const showToast = useCustomToast()
  const [tag, setTag] = useState('')


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
      <Layout categories={data} setSort={setSort} types={dataTypes} setTag={setTag}>
        {data_items ? (
          data_items.map((item) => <ProductCard key={item.id} item={item} />)
        ) : (
          <p className="col-span-full mx-auto my-10 text-sm text-gray-400">
            No item found
          </p>
        )}
      </Layout>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        className="mt-20"
      />
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

  const movieId = context.params.movieId

  const limit = 9
  const offset = (context.query.page - 1) * limit || 0

  const dataItems = await fetchData(
    `http://localhost:4000/v1/marketplace/movie/${movieId}/products?limit=${limit}&offset=${offset}`
  )

  const totalItems = await fetchData(
    `http://localhost:4000/v1/marketplace/movie/${movieId}/products/count`
  )

  const data = await fetchData('http://localhost:4000/v1/marketplace/tags')
  const dataTypes = data

  const currentPage = context.query.page || 1
  const totalPages = Math.ceil(totalItems.count / limit)

  return {
    props: {
      movieId,
      data,
      dataItems,
      dataTypes,
      totalPages,
      cookie,
      currentPage,
    },
  }
}

export default Category
