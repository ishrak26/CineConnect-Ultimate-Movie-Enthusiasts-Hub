import { tmdb } from '@lib/service'
import { useRouter } from 'next/router'
import Card from '@components/card'
import Navbar from '@components/navbar'
import Segmented from '@components/segmented'
import Head from 'next/head'
import Footer from '@components/footer'
import Search from '@components/search'
import Pagination from '@components/pagination'
import BaseLayout from '@components/BaseLayout'
import Profile from '@components/profiles'
// import Row from '@components/Row'
import Layout from './layout'
import dynamic from 'next/dynamic'

const Row = dynamic(() => import('@components/Row'))

export default function Home({
  topRated,
  netflixOriginals,
  actionMovies,
  query,
}) {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>CineConnect</title>
        <meta // meta tags for SEO, works to improve the search engine ranking
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
        <div className="container">
          <div className="flex flex-row items-center justify-center">
            {/* Div for the image */}
            <div className="mr-20">
              <img src="/cover.gif" alt="Cover" className="w-full h-auto" />
            </div>

            {/* Div for the text */}
            <div className="max-w-xl">
              <h1 className="heading-xl">CineConnect</h1>
              <p className="text-gray-400 mt-4">
                Millions of movies, TV shows and people to discover. Explore
                now.
              </p>
            </div>
          </div>
          <section className="md:space-y-24 pt-5">
            <div className="pb-4 my-5">
              <Row
                // movies={trending.results}
                movies={topRated}
                title="Trending Now"
                isMain={true}
              />
            </div>
            <div className="pb-4 my-5">
              <Row
                movies={netflixOriginals}
                title="Most Popular"
                isMain={true}
              />
            </div>

            <div className="pb-4 my-5">
              <Row
                movies={actionMovies}
                title="Top Hits"
                isMain={true}
              />
            </div>
          </section>

          {/* <Segmented
            className="my-6"
            name="home"
            defaultIndex={query.tab === 'tv' ? 2 : query.tab === 'movie' ? 1 : 0}
            segments={[
              {
                label: 'All',
                value: 'all',
              },
              {
                label: 'Movies',
                value: 'movie',
              },
              {
                label: 'TV Shows',
                value: 'tv',
              },
            ]}
            callback={(val) =>
              router.replace({ pathname: '/', query: { tab: val } })
            }
          />

          <div className="card-list">
            {trending.results.map((result) => (
              <Card
                key={result.id}
                id={result.id}
                image={result.poster_path}
                title={result.title || result.name}
                type={result.media_type}
                rating={result.vote_average}
              />
            ))}
          </div>

          <Pagination
            currentPage={query.page}
            totalPages={trending.total_pages}
            className="mt-8"
          /> */}

          <div className="pb-14 my-40">
            <Footer className="flex width-full" />
          </div>
        </div>
      </BaseLayout>
    </div>
  )
}

export async function getServerSideProps(context) {
  const query = context.query
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
      return await response.json()
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { notFound: true }
      }
      return { error: error.message }
    }
  }

  // Use Promise.all to fetch data for different categories concurrently
  try {
    const limit = 10
    const offset = 45
    const offset2 = 15
    const offset3 = 30
    const [topRated, netflixOriginals, actionMovies] = await Promise.all([
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/movies?limit=${limit}&offset=${offset3}`
      ),
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/movies?limit=${limit}&offset=${offset}`
      ),
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/movies?limit=${limit}&offset=${offset2}`
      ),
    ])

    // Check if any of the responses indicate 'not found'
    if (
      topRated.notFound ||
      netflixOriginals.notFound ||
      actionMovies.notFound
    ) {
      return { notFound: true }
    }

    return {
      props: {
        topRated,
        netflixOriginals,
        actionMovies,
        // Add other props as needed
      },
    }
  } catch (error) {
    console.error('Error during data fetching:', error)
    return {
      props: {
        error: error.message,
      },
    }
  }
}
