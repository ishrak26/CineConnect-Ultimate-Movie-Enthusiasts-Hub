import { tmdb } from '@lib/service'
import Head from 'next/head'
import Navbar from '@components/navbar'
import Footer from '@components/footer'
import SearchIcon from '@components/icons/search.svg'
import Card from '@components/card'
import Pagination from '@components/pagination'
import Breadcrumb from '@components/breadcrumb'
import Filters from '@components/filters'
import Link from 'next/link'

export default function MoviePage({ data, query, genres }) {
  return (
    <div>
      <Head>
        <title>Movies &mdash; CineConnect</title>
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

      <div className="container pb-12 animate-fade-in">
        <div className="my-20 max-w-xl">
          <Breadcrumb
            pages={[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: '/movie',
                label: 'Movies',
              },
            ]}
          />
          <h1 className="heading-xl mt-4">Movies</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[260px] flex-shrink-0 relative">
            <div className="sticky top-24">
              <Filters genres={genres} />
            </div>
          </div>
          <div className="w-full">
            {data?.length ? (
              <div>
                <div className="card-list lg:grid-cols-2 xl:grid-cols-3">
                  {data.map((result) => (
                    <Card
                      key={result.id}
                      id={result.id}
                      image={result.poster_url}
                      title={result.title}
                      rating={result.rating}
                      type="movie"
                    />
                  ))}
                </div>
                <Pagination
                  totalPages={data.total_pages}
                  currentPage={query.page}
                  className="mt-8"
                />
              </div>
            ) : (
              <div className="h-96 lg:h-full grid place-items-center bg-black-10 rounded-xl">
                <div className="flex flex-col items-center">
                  <SearchIcon className="text-3xl mb-4" />
                  <span>No result for this filters</span>
                  <Link
                    href="/movie"
                    className="button button-primary button-sm mt-4"
                  >
                    Clear filters
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  // const response = await tmdb.get('/discover/movie', {
  //   params: {
  //     ...query,
  //   },
  // })

  const limit = 10
  const response = await fetch(
    `http://localhost:4000/v1/movies?limit=${limit}`
  ).then((res) => res.json())

  // if (response.status === 404) {
  //   return {
  //     notFound: true,
  //   }
  // }

  // if (response.data.success === false) {
  //   return {
  //     props: {
  //       error: {
  //         statusCode: response.status,
  //         statusMessage:
  //           response.data.errors[0] || response.data.status_message,
  //       },
  //     },
  //   }
  // }

  const { data: genresData } = await tmdb.get('/genre/movie/list')

  return {
    props: {
      data: response,
      genres: genresData.genres,
      query,
    },
  }
}
