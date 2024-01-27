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

export default function Home({ data, query }) {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>CineConnect</title>
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
                Millions of movies, TV shows and people to discover. Explore now.
              </p>
            </div>
          </div>

          <Segmented
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
            {data.results.map((result) => (
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
            totalPages={data.total_pages}
            className="mt-8"
          />
          <Footer className="flex width-full" />
        </div>
      </BaseLayout>

    </div>
  )
}

export async function getServerSideProps({ query }) {
  const response = await tmdb.get(`/trending/${query.tab || 'all'}/week`, {
    params: {
      page: query.page || 1,
    },
  })

  if (response.status === 404) {
    return {
      notFound: true,
    }
  }

  if (response.data.success === false) {
    return {
      props: {
        error: {
          statusCode: response.status,
          statusMessage: response.data.status_message,
        },
      },
    }
  }

  return {
    props: {
      data: response.data,
      query,
    },
  }
}
