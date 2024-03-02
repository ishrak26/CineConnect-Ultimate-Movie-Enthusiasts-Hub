import About from '@/components/forum/About'
import CreatePostLink from '@/components/forum/CreatePostLink'
import PageContent from '@/components/forum/PageContent'
import Posts from '@/components/forum/Posts'
import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@theme/theme'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { map } from 'leaflet'

import 'leaflet/dist/leaflet.css'

const TheatrePage = ({ mapTiler }) => {
  const [center, setCenter] = useState({ lat: 13.084622, lng: 80.248357 })
  const ZOOM_LEVEL = 9
  const mapRef = useRef()

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
          <PageContent>
            <div className="row">
              <div className="col text-center">
                <h2>React-leaflet - Basic Openstreet Maps</h2>
                <p>Loading basic map using layer from maptiler</p>
                <div className="col">
                  <Map center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
                    <TileLayer
                      url={mapTiler.url}
                      attribution={mapTiler.attribution}
                    />
                  </Map>
                </div>
              </div>
            </div>
          </PageContent>
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
