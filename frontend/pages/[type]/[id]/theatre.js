import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@theme/theme'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'

import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('@components/theatre/TheatreHome'), {
  ssr: false,
})

const TheatrePage = ({ mapTiler }) => {
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

        <Navbar />
        <BaseLayout>
          <div>
            <MapWithNoSSR mapTiler={mapTiler} />
          </div>
        </BaseLayout>
      </ChakraProvider>
    </>
  )
}

export async function getServerSideProps(context) {
  const mapTiler = {
    url: process.env.MAPTILER_URL,
    attribution: process.env.MAPTILER_ATTRIBUTION,
  }
  console.log('mapTiler', mapTiler)
  return { props: { mapTiler } }
}

export default TheatrePage
