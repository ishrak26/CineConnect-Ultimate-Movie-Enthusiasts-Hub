import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import CardSkeleton from '@/components/marketplace/cardskeleton'
import Layout from '@/components/marketplace/layout'
import ProductCard from '@/components/marketplace/productcard'
// import { recentCategory } from '../../slices/categorySlice'
import Head from 'next/head'
import useCustomToast from '@/hooks/useCustomToast'
import Pagination from '@components/pagination'
// import { set } from 'react-nprogress'
// import { da } from 'date-fns/locale'

function Category({
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

  const [filteredDataItems, setFilteredDataItems] = useState(dataItems)

  useEffect(() => {
    const fetchProductsByTag = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/products?tags=${tag}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(cookie ? { Cookie: cookie } : {}),
            },
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch products by tag')
        }

        const data = await response.json()

        setFilteredDataItems(data)
      } catch (error) {
        showToast('Failed to fetch products by tag', 'error')
      }
    }

    if (tag) fetchProductsByTag()
  }, [tag])

  const data_items = filteredDataItems
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
        style={{ display: 'flex', flexDirection: 'column', minHeight: '300vh' }}
      >
        <div style={{ flex: 1 }} className="my-10">
          <Layout
            categories={data}
            setSort={setSort}
            types={dataTypes}
            setTag={setTag}
            // movie={movie.title}
            isHome={false}
          >
            {data_items ? (
              data_items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))
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

export async function getServerSideProps({ query }) {
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

  const limit = 9
  const offset = (query.page - 1) * limit || 0

  const values = query.query
    .split(',')
    .flatMap((v) => v.split(' '))
    .filter((v) => v.trim() !== '')

  // Construct query parameters
  let tags = 'tags='
  // let movies = 'movies='

  values.forEach((v) => {
    if (v.trim()) {
      tags += `${v.trim()},`
      // movies += `${v.trim()},`
    }
  })

  // Remove trailing comma
  tags = tags.slice(0, -1)
  // movies = movies.slice(0, -1)

  const dataItems = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/products?limit=${limit}&offset=${offset}&${tags}`
  )

  const totalItems = dataItems.length
  // console.log('Total Items ', totalItems)

  const data = await fetchData(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/marketplace/tags`
  )
  const dataTypes = data

  const currentPage = query.page || 1
  const totalPages = Math.ceil(totalItems / limit)

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
