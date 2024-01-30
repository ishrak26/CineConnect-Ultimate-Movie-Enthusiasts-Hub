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
// import Row from '@components/Row'
import Layout from './layout'
import dynamic from 'next/dynamic'

const Row = dynamic(() => import('@components/Row'))

export default function Home({ topRated, netflixOriginals,actionMovies, query }) {
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

          <section className="md:space-y-24 pt-5">
            <div className="pb-4 my-5">
              
            <Row
              // movies={trending.results}
              movies={topRated}
              title="Top Rated"
              isMain={true}
            />
            </div>
            <div className="pb-4 my-5">
            <Row movies={netflixOriginals} title="Netflix Originals" isMain={true} />
            </div>

            <div className="pb-4 my-5">
              <Row
                movies={actionMovies}
                title="Action Thrillers"
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

export async function getServerSideProps({ query }) {
   // Helper function to fetch data
   async function fetchData(url, params) {
    try {
      const response = await tmdb.get(url, { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { notFound: true };
      }
      return { error: error.message };
    }
  }
  // Fetch data for different categories
  // const trending = await fetchData(`/trending/${query.tab || 'all'}/week`, { page: query.page || 1 });
  // const netflixOriginals = await fetchData('/discover/movie', { with_networks: 213 });
  // const actionMovies = await fetchData('/discover/movie', { with_genres: 28 });

  const topRated = await fetch(`http://localhost:4000/v1/movies/`).then((res) => res.json());
  const netflixOriginals = await fetch(`http://localhost:4000/v1/movies/`).then((res) => res.json());
  const actionMovies = await fetch(`http://localhost:4000/v1/movies/`).then((res) => res.json());

  // Consolidate errors and data
  if (topRated.notFound || netflixOriginals.notFound || actionMovies.notFound) {
    return { notFound: true };
  }

  if (topRated.error || netflixOriginals.error || actionMovies.error) {
    return {
      props: {
        error: {
          message: topRated.error || netflixOriginals.error || actionMovies.error,
        },
      },
    };
  }

  // return {
  //   props: {
  //     trending: trending,
  //     netflixOriginals: netflixOriginals,
  //     actionMovies: actionMovies,
  //     query,
  //   },
  // };

  return {
    props: {
      topRated: topRated,
      netflixOriginals: netflixOriginals,
      actionMovies: actionMovies,
      query,
    },
  };
}
