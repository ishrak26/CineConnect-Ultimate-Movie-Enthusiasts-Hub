import { tmdb } from '@lib/service'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@components/navbar'
import Footer from '@components/footer'
import Search from '@components/search'
import SearchIcon from '@components/icons/search.svg'
import Segmented from '@components/segmented'
import Card from '@components/card'
import Pagination from '@components/pagination'
import Breadcrumb from '@components/breadcrumb'

export default function Home({ data, query }) {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>Search &mdash;CineConnect</title>
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
                href: '/search',
                label: 'Search',
              },
            ]}
          />
          <h1 className="heading-xl mt-4">Search</h1>
          <Search />
        </div>

        {query.query && (
          <div>
            <Segmented
              name="search"
              className="my-6"
              defaultIndex={
                query.type === 'person'
                  ? 3
                  : query.type === 'collection'
                  ? 2
                  : query.type === 'tv'
                  ? 1
                  : 0
              }
              segments={[
                {
                  label: 'Movies',
                  value: 'movie',
                },
                {
                  label: 'TV Shows',
                  value: 'tv',
                },
                {
                  label: 'Collections',
                  value: 'collection',
                },
                {
                  label: 'Persons',
                  value: 'person',
                },
              ]}
              callback={(val) =>
                router.replace({
                  pathname: '/search',
                  query: { ...router.query, type: val, page: 1 },
                })
              }
            />

            {data?.length ? (
              <div>
                <div className="card-list">
                  {data.map((result) => (
                    <Card
                      key={result.id}
                      id={result.id}
                      image={result.poster_url || result.profile_path}
                      title={result.title || result.name}
                      type={query.type || 'movie'}
                      rating={result.rating}
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
              <div className="h-96 grid place-items-center bg-black-10 rounded-xl">
                <div className="flex flex-col items-center">
                  <SearchIcon className="text-3xl mb-4" />
                  <span>No result for {query.query}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const searchQuery = query.query

  if (!searchQuery) {
    return {
      props: {
        query,
      },
    }
  }

  // const response = await tmdb.get(`/search/${query.type || 'movie'}`, {
  //   params: {
  //     ...query,
  //   },
  // })
  
  //Add query here 

  const response = await fetch(`http://localhost:4000/v1/movies/?title=${query.query}`).then((res) => res.json());


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
  //           response.data.errors[0] || response.data.status.message,
  //       },
  //     },
  //   }
  // }

  return {
    props: {
      data: response,
      query,
    },
  }
}
