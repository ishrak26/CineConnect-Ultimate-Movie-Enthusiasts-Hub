import React, { useEffect, useState } from 'react'
import CardSkeleton from '@/components/marketplace/cardskeleton'
import Layout from '@/components/marketplace/layout'
import ProductCard from '@/components/marketplace/productcard'
import { useSelector } from 'react-redux'
// import { recentCategory } from "../../slices/categorySlice";
import Head from 'next/head'


export async function getStaticProps() {
  //   const res = await fetch(process.env.NEXT_PUBLIC_APIURL + "/categories");
  const res = []
  //   const data = await res.json()
  const data = []
  //   const resTypes = await fetch(process.env.NEXT_PUBLIC_APIURL + "/types");
  const resTypes = []
  //   const dataTypes = await resTypes.json()
  const dataTypes = [
    {
      name: 'Action',
      slug: 'action',
    },
    {
      name: 'Adventure',
      slug: 'adventure',
    },
  ]
  //   const resItems = await fetch(
  //     process.env.NEXT_PUBLIC_APIURL + `/items?_sort=published_at:DESC`
  //   );
  const resItems = []
  //   const dataItems = await resItems.json()
  const dataItems = [
    {
      name: 'Avengers Notebook',
      slug: 'action',
      price: '150',
      image:
        'https://i.pinimg.com/474x/e8/a0/e7/e8a0e73fb27494d6d853a54d14db2e01.jpg',
      type: {
        name: 'Avengers Notebook',
        slug: 'action',
      },
    },
    {
      name: 'Interstellar Notebook',
      slug: 'adventure',
      price: '200',
      image:
        'https://ih1.redbubble.net/image.3103823573.8682/sn,x1000-pad,750x1000,f8f8f8.jpg',
      type: {
        name: 'Interstellar Notebook',
        slug: 'adventure',
      },
    },
    {
      name: 'The Dark Knight Fan Art',
      slug: 'action',
      price: '300',
      image:
        'https://i.pinimg.com/originals/53/c9/1b/53c91beb461e132182f4066c11d5a01f.jpg',
      type: {
        name: 'The Dark Knight Fan Art',
        slug: 'action',
      },
    },
    {
      name: 'The Martian Fan Art',
      slug: 'adventure',
      price: '250',
      image:
        'https://64.media.tumblr.com/4c6fcc425f739e3e2552063701f02d52/tumblr_nvpb665eIy1r3b9i7o1_r2_640.pnj',
      type: {
        name: 'The Martian Fan Art',
        slug: 'adventure',
      },
    },
    {
      name: 'Wall-E Laptop Skin',
      slug: 'adventure',
      price: '300',
      image:
        'https://ih1.redbubble.net/image.2224126640.1922/pd,x500,macbook_air_13-pad,750x1000,f8f8f8.jpg',
      type: {
        name: 'Wall-E Laptop Skin',
        slug: 'adventure',
      },
    },
    {
      name: 'The Dark Knight Phone Cover',
      slug: 'action',
      price: '250',
      image:
        'https://www.redwolf.in/image/cache/catalog/mobile-covers/apple-iphone-14/batman-on-city-mobile-cover-india-1-600x800.jpg',
      type: {
        name: 'The Dark Knight Phone Cover',
        slug: 'action',
      },
    },
    {
      name: 'The Godfather fan art',
      slug: 'action',
      price: '200',
      image:
        'https://posterdrops-images.s3.amazonaws.com/art_images/316407442_10160571014479675_4156188606114148861_n_1669323055.jpeg',
      type: {
        name: 'The Godfather fan art',
        slug: 'action',
      },
    },
  ]

  return {
    props: {
      data,
      dataItems,
      dataTypes,
    },
    revalidate: 5,
  }
}

function Category({ data, dataItems, dataTypes }) {
  const [sort, setSort] = useState(0)
  //   const recent_category = useSelector(recentCategory)
  const recent_category = ''
  const data_items = dataItems
    .filter((item) => {
      if (recent_category.length > 0) {
        return item.type.name == recent_category
      } else {
        return true
      }
    })
    .sort((a, b) => {
      if (sort === 1) {
        return a.price - b.price
      }
      if (sort === 2) {
        return b.price - a.price
      }
      return true
    })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <>
    
      <Head>
        <title>CineConnect | Shop</title>
      </Head>

        <Layout categories={data} setSort={setSort} types={dataTypes}>
          {!loading ? (
            data_items.length < 1 ? (
              <p className="col-span-full mx-auto text-sm text-gray-400">
                No item found
              </p>
            ) : (
              data_items.map((item) => (
                <ProductCard key={item.slug} item={item} />
              ))
            )
          ) : (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          )}
        </Layout>

    </>
  )
}

export default Category
