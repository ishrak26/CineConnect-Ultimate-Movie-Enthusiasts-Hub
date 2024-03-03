import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@theme/theme'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import TheaterList from '@components/theatre/TheatreList'
import CategoryList from '@components/theatre/CategoryList'
import RangeSelect from '@components/theatre/RangeSelect'
import SetPrice from '@components/theatre/SetPrice'

import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('@components/theatre/TheatreHome'), {
  ssr: false,
})

const TheatrePage = ({ mapTiler, movieId }) => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Theatres &mdash; CineConnect</title>
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

        <BaseLayout>
          <Navbar />
          <div
            className="grid 
    grid-cols-1
    md:grid-cols-4 "
          >
            <div className="p-3 pt-20">
              <CategoryList onCategoryChange={(value) => setCategory(value)} />
              <RangeSelect onRadiusChange={(value) => setRadius(value)} />
              {/* <SelectRating onRatingChange={(value) => onRatingChange(value)} /> */}
              <SetPrice />

              <button
                type="button"
                // onClick={handleSizeSubmit}
                className="px-4 py-2 my-5 text-black-100 bg-primary-600 rounded-r focus:outline-none hover:bg-primary-800 transition-all duration-300 ease-in-out w-full md:w-3/4 mx-auto"
              >
                Filter
              </button>
            </div>
            <div className="col-span-3 pt-10">
              <MapWithNoSSR mapTiler={mapTiler} movieId={movieId} />
              <div
                className="md:absolute mx-2 w-[90%] md:w-[74%]
           bottom-36 relative md:bottom-3"
              >
                <TheaterList />
              </div>
            </div>
          </div>
        </BaseLayout>
      </ChakraProvider>
    </>
  )
}

export async function getServerSideProps(context) {
  // console.log('context', context)
  const mapTiler = {
    url: process.env.MAPTILER_URL,
    attribution: process.env.MAPTILER_ATTRIBUTION,
  }
  // console.log('mapTiler', mapTiler)
  return { props: { mapTiler, movieId: context.params.id } }
}

export default TheatrePage
