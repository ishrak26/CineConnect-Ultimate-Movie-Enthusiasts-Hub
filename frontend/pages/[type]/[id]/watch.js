import { tmdb } from '@lib/service'
import zones from '@lib/timezones.json'
import Navbar from '@components/navbar'
import Head from 'next/head'
import Breadcrumb from '@components/breadcrumb'
import Footer from '@components/footer'
import Link from 'next/link'
import clsx from 'clsx'
import { InputGroup, InputLabel } from '@components/input'
import { useEffect, useState } from 'react'
import Provider from '@components/provider'
import ReactCountryFlag from 'react-country-flag'
import JustWatch from '@components/icons/justwatch.svg'
import Recommendations from '@components/recommendations'

export default function Home({
  data,
  type,
  regions,
  providers,
  // backdropData,
  // posterData,
}) {
  const [region, setRegion] = useState('US')

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (!zones[timezone] || !zones[timezone].countries.length) {
      return
    }

    setRegion(zones[timezone].countries[0])
  }, [])

  return (
    <div>
      <Head>
        <title>{`Watch providers for ${
          data.title || data.name
        } — Movielister`}</title>
        <meta
          name="description"
          content="Millions of movies, TV shows and people to discover. Explore now."
        />
        <meta
          name="keywords"
          content="where can i watch, movie, movies, tv, tv shows, cinema, movielister, movie list, list"
        />
        <meta
          property="og:url"
          content={`https://movielister.site/${type}/${data.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={data.title || data.name} />
        <meta property="og:description" content={data.overview} />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="movielister.site" />
        <meta
          property="twitter:url"
          content={`https://movielister.site/${type}/${data.id}/watch`}
        />
        <meta name="twitter:title" content={data.title || data.name} />
        <meta name="twitter:description" content={data.overview} />
        <meta
          name="twitter:image"
          content={`https://image.tmdb.org/t/p/w780${data.backdrop_path}`}
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <Navbar />

      <div className="container pb-12 mt-10">
        <div className="w-full relative">
          <img
            // src={backdropData.img.src}
            src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
            alt={data.title || data.name}
            className="h-96 md:h-[480px] w-full object-cover object-center rounded-[40px]"
            loading="eager"
            // blurDataURL={backdropData.base64}
            // placeholder={backdropData.base64 ? 'blur' : 'empty'}
            // width={1600}
            // height={900}
          />
        </div>
        <div
          className={clsx(
            'p-8 md:p-10 rounded-[40px] bg-grey-900 bg-opacity-80 backdrop-blur-md max-w-xl relative -top-16 lg:ml-20 -mb-16'
          )}
        >
          <Breadcrumb
            pages={[
              {
                href: '/',
                label: 'Home',
              },
              {
                href: type === 'movie' ? '/movie' : type === 'tv' ? '/tv' : '#',
                label: type === 'movie' ? 'Movies' : 'TV Shows',
              },
              {
                href: `/${type}/${data.id}`,
                label: data.title || data.name,
              },
              {
                href: `/${type}/${data.id}/watch`,
                label: 'Watch',
              },
            ]}
          />
          <h1 className="heading-lg">{data.title || data.name}</h1>
        </div>

        <div className="mt-8 md:m-12 md:mt-8 xl:m-20 xl:mt-8">
          <div className="flex flex-col-reverse mt-5 mb-8 gap-12 md:gap-20 lg:flex-row">
            <div className="lg:w-1/2">
              <div className="aspect-poster">
                <img
                  // src={posterData.img.src}
                  src={`https://image.tmdb.org/t/p/w780${data.poster_path}`}
                  alt={data.title || data.name}
                  className="rounded-[40px] object-cover w-full h-full"
                  // placeholder={posterData.base64 ? 'blur' : 'empty'}
                  // blurDataURL={posterData.base64}
                  // width={480}
                  // height={710}
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="flex justify-between items-center mb-2">
                <a
                  href="https://www.justwatch.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <JustWatch className="w-32 flex-shrink-0 mr-16" />
                </a>
                <InputGroup>
                  <ReactCountryFlag
                    className="input-icon"
                    countryCode={region}
                    style={{
                      fontSize: '1.5rem',
                    }}
                    svg
                  />
                  <select
                    className="input appearance-none has-icon"
                    name="region"
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    {regions?.results?.map((region) => (
                      <option key={region.iso_3166_1} value={region.iso_3166_1}>
                        {region.english_name}
                      </option>
                    )) ?? <option value="US">United States</option>}
                  </select>
                  <InputLabel>Select Region</InputLabel>
                </InputGroup>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="block mb-4 text-white-40">Stream</span>
                  <div className="flex flex-wrap gap-4">
                    {providers?.results[region]?.flatrate?.map((provider) => (
                      <Provider
                        key={provider.provider_id}
                        name={provider.provider_name}
                        logo={provider.logo_path}
                        link={providers?.results[region].link}
                      />
                    )) ?? <Provider />}
                  </div>
                </div>

                <div>
                  <span className="block mb-4 text-white-40">Buy</span>
                  <div className="flex flex-wrap gap-4">
                    {providers?.results[region]?.buy?.map((provider) => (
                      <Provider
                        key={provider.provider_id}
                        name={provider.provider_name}
                        logo={provider.logo_path}
                      />
                    )) ?? <Provider />}
                  </div>
                </div>

                <div>
                  <span className="block mb-4 text-white-40">Rent</span>
                  <div className="flex flex-wrap gap-4">
                    {providers?.results[region]?.rent?.map((provider) => (
                      <Provider
                        key={provider.provider_id}
                        name={provider.provider_name}
                        logo={provider.logo_path}
                      />
                    )) ?? <Provider />}
                  </div>
                </div>
              </div>

              <Link
                href={`/${type}/${data.id}/`}
                className="flex justify-center button button-primary mt-8"
              >
                Details
              </Link>
            </div>
          </div>

          {data.recommendations?.results?.length > 0 && (
            <Recommendations recommendations={data.recommendations.results} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const response = await tmdb.get(`/${params.type}/${params.id}`, {
    params: {
      append_to_response: 'recommendations',
    },
  })
  const regions = await tmdb.get(`/watch/providers/regions`)
  const providers = await tmdb.get(
    `/${params.type}/${params.id}/watch/providers`
  )

  if (response.status === 404) {
    return {
      notFound: true,
    }
  }

  if (response.data.success === false || providers.data.success === false) {
    return {
      props: {
        error: {
          statusCode: response.status,
          statusMessage: response.data.status_message,
        },
      },
    }
  }

  // const backdropData = response.data.backdrop_path
  //   ? await getPlaiceholder(
  //       `https://image.tmdb.org/t/p/original${response.data.backdrop_path}`
  //     )
  //   : {
  //       img: {
  //         src: '/placeholder.svg',
  //       },
  //     }

  // const posterData = response.data.poster_path
  //   ? await getPlaiceholder(
  //       `https://image.tmdb.org/t/p/w780${response.data.poster_path}`
  //     )
  //   : {
  //       img: {
  //         src: '/placeholder.svg',
  //       },
  //     }

  return {
    props: {
      type: params.type,
      data: response.data,
      regions: regions.data,
      providers: providers.data,
      // backdropData,
      // posterData,
    },
  }
}
