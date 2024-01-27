import { tmdb } from '@lib/service'
import { format, formatDuration, intervalToDuration } from 'date-fns'
import ArrowIcon from '@components/icons/arrow.svg'
import Navbar from '@components/navbar'
import Rating from '@components/rating'
import Head from 'next/head'
import Part from '@components/part'
import Credits from '@components/credits'
import Breadcrumb from '@components/breadcrumb'
import Cast from '@components/cast'
import Media from '@components/media'
import Recommendations from '@components/recommendations'
import Profiles from '@components/profiles'
import Footer from '@components/footer'
import Card from '@components/card'
import Link from 'next/link'
import clsx from 'clsx'
import ScrollContent from '@components/scroll-content'

export default function Home({
  data,
  type,
  // backdropData,
  // posterData,
  // profileData,
}) {
  return (
    <div>
      <Head>
        <title>{`${data.title || data.name} — Movielister`}</title>
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
        <meta
          property="og:description"
          content={type === 'person' ? data.biography : data.overview}
        />
        <meta
          property="og:image"
          content={
            type === 'person'
              ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
              : `https://image.tmdb.org/t/p/w500${data.poster_path}`
          }
        />

        <meta
          name="twitter:card"
          content={type === 'person' ? 'summary' : 'summary_large_image'}
        />
        <meta property="twitter:domain" content="movielister.site" />
        <meta
          property="twitter:url"
          content={`https://movielister.site/${type}/${data.id}`}
        />
        <meta name="twitter:title" content={data.title || data.name} />
        <meta
          name="twitter:description"
          content={type === 'person' ? data.biography : data.overview}
        />
        <meta
          name="twitter:image"
          content={
            type === 'person'
              ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
              : `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
          }
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <Navbar />

      <div className="container pb-12 mt-10">
        {type !== 'person' && (
          <div className="w-full relative">
            <img
              // src={backdropData.img.src}
              src={
                data.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
                  : '/placeholder.svg'
              }
              alt={data.title || data.name}
              className="h-96 md:h-[480px] w-full object-cover object-center rounded-[40px]"
              loading="eager"
              // blurDataURL={backdropData.base64}
              // placeholder={backdropData.base64 ? 'blur' : 'empty'}
              // width={1600}
              // height={900}
            />
          </div>
        )}
        <div
          className={clsx(
            'p-8 md:p-10 rounded-[40px] bg-grey-900 bg-opacity-80 backdrop-blur-md max-w-xl relative',
            type !== 'person' && '-top-16 lg:ml-20 -mb-16'
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
                label:
                  type === 'movie'
                    ? 'Movies'
                    : type === 'tv'
                    ? 'TV Shows'
                    : type === 'person'
                    ? 'Person'
                    : 'Collection',
              },
              {
                href: '##',
                label: data.title || data.name,
              },
            ]}
          />
          <h1 className="heading-lg">{data.title || data.name}</h1>
        </div>

        {(type === 'movie' || type === 'tv') && (
          <div className="mt-8 md:m-12 md:mt-8 xl:m-20 xl:mt-8">
            {data.credits?.cast.length > 0 && <Cast cast={data.credits.cast} />}

            <div className="flex flex-col-reverse my-5 gap-12 md:gap-20 lg:flex-row">
              <div className="lg:w-1/2">
                <div className="aspect-poster">
                  <img
                    // src={posterData.img.src}
                    src={
                      data.poster_path
                        ? `https://image.tmdb.org/t/p/w780${data.poster_path}`
                        : '/placeholder.svg'
                    }
                    alt={data.title || data.name}
                    className="rounded-[40px] object-cover w-full h-full"
                    // placeholder={posterData.base64 ? 'blur' : 'empty'}
                    // blurDataURL={posterData.base64}
                    // width={480}
                    // height={710}
                  />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <h2 className="heading">{data.tagline || 'Overview'}</h2>
                <p className="text-white-65">{data.overview}</p>

                <Link
                  href={`/${type}/${data.id}/watch`}
                  className="flex justify-center button button-primary"
                >
                  Watch
                </Link>

                <Rating average={data.vote_average} />

                {type === 'movie' && (
                  <div className="space-y-6">
                    {data.credits?.crew && <Credits crew={data.credits.crew} />}

                    <p>
                      <span className="text-sm text-white-30">Type</span>
                      <span className="block mt-2">Movie</span>
                    </p>
                    {data.release_date && (
                      <p>
                        <span className="text-sm text-white-30">
                          Release Date
                        </span>
                        <span className="block mt-2">
                          {format(new Date(data.release_date), 'd MMMM, yyyy')}
                        </span>
                      </p>
                    )}
                    {data.runtime && (
                      <p>
                        <span className="text-sm text-white-30">Runtime</span>
                        <span className="block mt-2">
                          {formatDuration(
                            intervalToDuration({
                              start: 0,
                              end: data.runtime * 60000,
                            }),
                            {
                              format: ['hours', 'minutes'],
                            }
                          )}
                        </span>
                      </p>
                    )}

                    <p>
                      <span className="text-sm text-white-30">Genres</span>
                      <span className="block mt-2">
                        {data.genres.map((genre) => genre.name).join(', ')}
                      </span>
                    </p>
                  </div>
                )}

                {type === 'tv' && (
                  <div className="grid grid-cols-2 gap-6">
                    {data.created_by.length > 0 && (
                      <p className="col-span-2">
                        <span className="text-sm text-white-30">Creators</span>
                        <span className="mt-2 grid grid-cols-2 gap-6">
                          {data.created_by.map((person) => (
                            <Link href={`/person/${person.id}`} key={person.id}>
                              {person.name}
                            </Link>
                          ))}
                        </span>
                      </p>
                    )}

                    <p>
                      <span className="text-sm text-white-30">Type</span>
                      <span className="block mt-2">TV Show</span>
                    </p>
                    {data.status && (
                      <p>
                        <span className="text-sm text-white-30">Status</span>
                        <span className="block mt-2">{data.status}</span>
                      </p>
                    )}
                    {data.first_air_date && (
                      <p>
                        <span className="text-sm text-white-30">
                          First air date
                        </span>
                        <span className="block mt-2">
                          {format(
                            new Date(data.first_air_date),
                            'd MMMM, yyyy'
                          )}
                        </span>
                      </p>
                    )}
                    {data.last_air_date && (
                      <p>
                        <span className="text-sm text-white-30">
                          Last air date
                        </span>
                        <span className="block mt-2">
                          {format(new Date(data.last_air_date), 'd MMMM, yyyy')}
                        </span>
                      </p>
                    )}
                    {data.number_of_seasons && (
                      <p>
                        <span className="text-sm text-white-30">Seasons</span>
                        <span className="block mt-2">
                          {data.number_of_seasons}
                        </span>
                      </p>
                    )}
                    {data.number_of_episodes && (
                      <p>
                        <span className="text-sm text-white-30">Episodes</span>
                        <span className="block mt-2">
                          {data.number_of_episodes}
                        </span>
                      </p>
                    )}

                    {data.episode_run_time.length > 0 && (
                      <p>
                        <span className="text-sm text-white-30">
                          Episode runtime
                        </span>
                        <span className="block mt-2">
                          {data.episode_run_time
                            .map((runtime) =>
                              formatDuration(
                                intervalToDuration({
                                  start: 0,
                                  end: runtime * 60000,
                                }),
                                {
                                  format: ['hours', 'minutes'],
                                }
                              )
                            )
                            .join(' - ')}
                        </span>
                      </p>
                    )}

                    <p>
                      <span className="text-sm text-white-30">Genres</span>
                      <span className="block mt-2">
                        {data.genres.map((genre) => genre.name).join(', ')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {(data.videos || data.images) && (
              <Media
                videos={data.videos?.results}
                posters={data.images?.posters}
                backdrops={data.images?.backdrops}
              />
            )}

            {data.belongs_to_collection && (
              <Link
                href={`/collection/${data.belongs_to_collection.id}`}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${data.belongs_to_collection.backdrop_path})`,
                }}
                className="relative bg-cover h-96 rounded-xl flex flex-col justify-center px-8 md:px-16 my-8"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black-75 to-transparent rounded-xl" />
                <div className="relative">
                  <span className="text-xl block text-white-65">
                    Part of a collection
                  </span>
                  <strong className="heading-lg">
                    Explore {data.belongs_to_collection.name}
                  </strong>
                  <button className="flex button button-primary mt-8">
                    Details <ArrowIcon className="ml-4" />
                  </button>
                </div>
              </Link>
            )}

            {data.recommendations?.results?.length > 0 && (
              <Recommendations recommendations={data.recommendations.results} />
            )}
          </div>
        )}

        {type === 'collection' && (
          <div className="mt-8 md:mx-12 xl:mx-20 space-y-6">
            {data.overview && (
              <div>
                <h2 className="heading">Overview</h2>
                <p className="text-white-65 mt-2">{data.overview}</p>
              </div>
            )}

            <div>
              <h3 className="heading mb-4">Parts</h3>

              <div className="space-y-6">
                {data.parts
                  .sort((a, b) =>
                    a.release_date && b.release_date
                      ? new Date(a.release_date) - new Date(b.release_date)
                      : false
                  )
                  .map((part) => (
                    <Part
                      key={part.id}
                      id={part.id}
                      title={part.title}
                      poster={part.poster_path}
                      overview={part.overview}
                      rating={part.vote_average}
                      date={part.release_date}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {type === 'person' && (
          <div>
            <div
              className={clsx(
                'flex my-5 gap-12 md:gap-20 lg:flex-row',
                type === 'person' ? 'flex-col' : 'flex-col-reverse'
              )}
            >
              <div className="lg:w-1/2">
                <div className="aspect-poster">
                  <img
                    // src={profileData.img.src}
                    src={
                      data.profile_path
                        ? `https://image.tmdb.org/t/p/w780${data.profile_path}`
                        : '/placeholder.svg'
                    }
                    alt={data.name}
                    className="rounded-[40px] object-cover w-full h-full"
                    // placeholder={profileData.base64 ? 'blur' : 'empty'}
                    // blurDataURL={profileData.base64}
                    // width={480}
                    // height={710}
                  />
                </div>
              </div>

              <div className="lg:w-1/2 space-y-6">
                {data.biography && (
                  <div>
                    <h2 className="heading">Biography</h2>
                    <p className="text-white-65">{data.biography}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  {data.known_for_department && (
                    <p>
                      <span className="text-sm text-white-30">Known for</span>
                      <span className="block mt-2">
                        {data.known_for_department}
                      </span>
                    </p>
                  )}

                  {data.birthday && (
                    <p>
                      <span className="text-sm text-white-30">Birthday</span>
                      <span className="block mt-2">
                        {format(new Date(data.birthday), 'dd MMMM, yyyy')}
                      </span>
                    </p>
                  )}

                  {data.place_of_birth && (
                    <p>
                      <span className="text-sm text-white-30">
                        Place of Birth
                      </span>
                      <span className="block mt-2">{data.place_of_birth}</span>
                    </p>
                  )}

                  {data.also_known_as.length > 0 && (
                    <p>
                      <span className="text-sm text-white-30">
                        Also known as
                      </span>
                      <span className="block mt-2">
                        {data.also_known_as.join(', ')}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {data.images.profiles.length > 1 && (
              <div>
                <h3 className="heading mb-4">Images</h3>
                <Profiles profiles={data.images.profiles} />
              </div>
            )}

            <div className="space-y-4">
              {data.known_for_department === 'Directing' && (
                <div>
                  <h3 className="heading mb-4">Directing Credits</h3>
                  <div className="card-list">
                    {data.credits?.crew
                      ?.filter((credit) => credit.job === 'Director')
                      .map((credit) => (
                        <Card
                          key={credit.credit_id}
                          id={credit.id}
                          image={credit.poster_path}
                          title={credit.title}
                          type="movie"
                          rating={credit.vote_average}
                        />
                      ))}
                  </div>
                </div>
              )}
              {data.credits?.cast?.length > 0 && (
                <div>
                  <h3 className="heading mb-4">
                    Movie Credits ({data.credits.cast.length})
                  </h3>
                  <ScrollContent className="gap-4">
                    {data.credits?.cast?.map((credit) => (
                      <Card
                        key={credit.credit_id}
                        id={credit.id}
                        image={credit.poster_path}
                        title={credit.title}
                        type="movie"
                        rating={credit.vote_average}
                        className="w-64 flex-shrink-0"
                      />
                    ))}
                  </ScrollContent>
                </div>
              )}
              {data.tv_credits?.cast?.length > 0 && (
                <div>
                  <h3 className="heading mb-4">
                    TV Credits ({data.tv_credits.cast.length})
                  </h3>
                  <ScrollContent className="gap-4">
                    {data.tv_credits?.cast?.map((credit) => (
                      <Card
                        key={credit.credit_id}
                        id={credit.id}
                        image={credit.poster_path}
                        title={credit.name}
                        type="tv"
                        rating={credit.vote_average}
                        className="w-64 flex-shrink-0"
                      />
                    ))}
                  </ScrollContent>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const response = await tmdb.get(`/${params.type}/${params.id}`, {
    params: {
      append_to_response: 'credits,videos,images,tv_credits,recommendations',
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

  // const profileData = response.data.profile_path
  //   ? await getPlaiceholder(
  //       `https://image.tmdb.org/t/p/original${response.data.profile_path}`
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
      // backdropData,
      // posterData,
      // profileData,
    },
  }
}
