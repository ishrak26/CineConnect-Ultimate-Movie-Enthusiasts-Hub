import React, { useEffect, useState } from 'react'
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
import { FaPlus, FaCheck, FaLock, FaArrowCircleRight } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import SetRating from '@components/SetRating'
import { useRouter } from 'next/router'

export default function Home({ data, type, casts }) {
  const [movieRating, setMovieRating] = useState(0.0)
  const [totalRatingCount, setTotalRatingCount] = useState(0)
  const [userRating, setUserRating] = useState(0)

  const [totalWatchCount, setTotalWatchCount] = useState(0)
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  const [totalWatchedCount, setTotalWatchedCount] = useState(0)
  const [isWatched, setIsWatched] = useState(false)

  const [isJoined, setIsJoined] = useState(false)

  const [movieImages, setMovieImages] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const getRating = async () => {
      const ratingResponse = await fetch(
        `http://localhost:4000/v1/movie/${data.id}/rating`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      // Check the response status code before proceeding to parse the JSON
      if (ratingResponse.ok) {
        // If the response is successful (status in the range 200-299)
        const ratingData = await ratingResponse.json() // Now it's safe to parse JSON
        if (!ratingData.user_rating) {
          setUserRating(0)
        } else {
          setUserRating(ratingData.user_rating)
        }
        setMovieRating(ratingData.average_rating)
        setTotalRatingCount(ratingData.total_ratings)
      } else {
        // If the response is not successful, log or handle the error
        console.error(
          'Error with request:',
          ratingResponse.status,
          ratingResponse.statusText
        )
        // Optionally, you can still read and log the response body
        // const responseBody = await ratingResponse.text()
        // console.log('Response Body:', responseBody)
      }
    }

    const getWatchData = async () => {
      const watchResponse = await fetch(
        `http://localhost:4000/v1/movie/${data.id}/watchInfo`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      if (watchResponse.ok) {
        const watchData = await watchResponse.json()

        setTotalWatchCount(watchData.watchlist_count)
        setTotalWatchedCount(watchData.watched_count)

        if (!watchData.user_in_watchlist) {
          setIsWatchlisted(false)
        } else {
          setIsWatchlisted(true)
        }

        if (!watchData.user_has_watched) {
          setIsWatched(false)
        } else {
          setIsWatched(true)
        }
      } else {
        console.error(
          'Error with request:',
          watchResponse.status,
          watchResponse.statusText
        )
        const responseBody = await watchResponse.text()
        console.log('Response Body:', responseBody)
      }
    }

    const getJoinedData = async () => {
      const joinedResponse = await fetch(
        `http://localhost:4000/v1/forum/${data.id}/joined`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      if (joinedResponse.ok) {
        const joinedData = await joinedResponse.json()
        if (!joinedData.joined) {
          setIsJoined(false)
        } else {
          setIsJoined(true)
        }
      } else {
        console.error(
          'Error with request:',
          joinedResponse.status,
          joinedResponse.statusText
        )
      }
    }

    const getMovieImages = async () => {
      const imageResponse = await fetch(
        `http://localhost:4000/v1/movie/${data.id}/images`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        // console.log('imageData', imageData)
        setMovieImages(imageData.images)
      } else {
        console.error(
          'Error with request:',
          imageResponse.status,
          imageResponse.statusText
        )
      }
    }

    getWatchData()
    getRating()
    getJoinedData()
    getMovieImages()
  }, [])

  const handleClickWatchlist = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/movie/${data.id}/watch`,
        {
          method: isWatchlisted ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )
      if (response.ok) {
        if (!isWatchlisted) {
          setTotalWatchCount(totalWatchCount + 1)
        } else {
          setTotalWatchCount(totalWatchCount - 1)
        }
        setIsWatchlisted(!isWatchlisted)
      } else {
        console.error(
          'Error with request:',
          response.status,
          response.statusText
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickWatched = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/movie/${data.id}/watched`,
        {
          method: isWatched ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )
      if (response.ok) {
        if (!isWatched) {
          setTotalWatchedCount(totalWatchedCount + 1)
        } else {
          setTotalWatchedCount(totalWatchedCount - 1)
        }
        setIsWatched(!isWatched)
      } else {
        console.error(
          'Error with request:',
          response.status,
          response.statusText
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickRating = async (rate) => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/movie/${data.id}/rate`,
        {
          method: userRating ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            rating: parseInt(rate),
          }),
        }
      )

      if (response.ok) {
        if (userRating === 0) {
          const newTotalRating = totalRatingCount + 1
          setTotalRatingCount(newTotalRating)
          setMovieRating((movieRating + rate) / newTotalRating)
        } else {
          setMovieRating(
            (movieRating * totalRatingCount - userRating + rate) /
              totalRatingCount
          )
        }
        setUserRating(rate)
      } else {
        console.error(
          'Error with request:',
          response.status,
          response.statusText
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickRemoveRating = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/movie/${data.id}/rate`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )
      if (response.ok) {
        setMovieRating(
          (movieRating * totalRatingCount - userRating) / (totalRatingCount - 1)
        )
        setTotalRatingCount(totalRatingCount - 1)
        setUserRating(0)
      } else {
        console.error(
          'Error with request for handleClickRemoveRating:',
          response.status,
          response.statusText
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickEnterForum = async () => {
    try {
      router.push(`/forum/${data.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleClickJoinForum = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/forum/${data.id}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      if (response.ok) {
        setIsJoined(true)
      } else {
        console.error(
          'Error with request for handleClickJoinForum:',
          response.status,
          response.statusText
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <Head>
        <title>{`CineConnect`}</title>
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

      <div className="container pb-12 mt-10">
        {type !== 'moviePerson' && (
          <div className="w-full relative">
            <img
              // src={backdropData.img.src}
              src={
                data.backdrop_url
                // data.backdrop_path
                // ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
                // : '/placeholder.svg'
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
            type !== 'moviePerson' && '-top-16 lg:ml-20 -mb-16'
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
                    : type === 'moviePerson'
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
            {/* {data.credits?.cast.length > 0 && <Cast cast={data.credits.cast} />} */}

            {casts && <Cast casts={casts} />}

            <div className="flex flex-col-reverse my-5 gap-12 md:gap-20 lg:flex-row">
              <div className="lg:w-1/2">
                <div className="aspect-poster">
                  <img
                    // src={posterData.img.src}
                    src={
                      data.poster_url
                      // ? `https://image.tmdb.org/t/p/w780${data.poster_path}`
                      // : '/placeholder.svg'
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
                <p className="text-white-65">{data.plot_summary}</p>

                {/* <Link
                  href={`/${type}/${data.id}/watch`}
                  className="flex justify-center button button-primary"
                >
                  Watch
                </Link> */}
                <button
                  onClick={handleClickWatchlist}
                  className="flex items-center justify-center button button-primary"
                >
                  {isWatchlisted ? (
                    <>
                      <FaCheck className="mr-2" /> Added to Watchlist
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Add to Watchlist
                    </>
                  )}
                </button>
                <span className="ml-2">
                  Added by {totalWatchCount} user{totalWatchCount > 1 && 's'}
                </span>
                <button
                  onClick={handleClickWatched}
                  className="flex items-center justify-center button button-primary"
                >
                  {isWatched ? (
                    <>
                      <FaCheck className="mr-2" /> Marked as Watched
                    </>
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Mark as Watched
                    </>
                  )}
                </button>
                <span className="ml-2">
                  Marked by {totalWatchedCount} user
                  {totalWatchedCount > 1 && 's'}
                </span>

                <SetRating
                  onRating={handleClickRating}
                  defaultRating={userRating}
                  userRated={userRating !== 0}
                />

                {userRating !== 0 && (
                  <button
                    onClick={handleClickRemoveRating}
                    className="flex items-center justify-center button button-primary"
                  >
                    <>
                      <RiDeleteBin6Line className="mr-2" /> Remove rating
                    </>
                  </button>
                )}

                {/* <Rating average={data.vote_average} /> */}
                <div className="text-xl text-primary-700 mr-8">
                  CineConnect Rating:{' '}
                  <Rating
                    average={movieRating}
                    count={totalRatingCount}
                    inMoviePage={true}
                  />
                </div>

                {type === 'movie' && (
                  <div className="space-y-6">
                    {data.credits?.crew && <Credits crew={data.credits.crew} />}

                    <p>
                      <span className="text-sm text-white-30">Type</span>
                      <span className="block mt-2">Movie</span>
                    </p>

                    {casts.directors && (
                      <p>
                        <span className="text-sm text-white-30">
                          Directed by
                        </span>
                        <span className="block mt-2">
                          {casts.directors.map((director, index) => (
                            <span key={director.id}>
                              {index > 0 ? ', ' : ''}
                              <Link
                                href={`/moviePerson/${director.id}`}
                                className="text-blue-500 hover:text-blue-800"
                              >
                                {director.name}
                              </Link>
                            </span>
                          ))}
                        </span>
                      </p>
                    )}
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
                    {data.duration_in_mins && (
                      <p>
                        <span className="text-sm text-white-30">Runtime</span>
                        <span className="block mt-2">
                          {formatDuration(
                            intervalToDuration({
                              start: 0,
                              end: data.duration_in_mins * 60000,
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
                    <div>
                      {isJoined && (
                        <button
                          className="flex items-center justify-center button button-primary"
                          onClick={handleClickEnterForum}
                        >
                          <>
                            <FaArrowCircleRight className="mr-2" /> Go to
                            Discussion Forum
                          </>
                        </button>
                      )}
                      {!isJoined && (
                        <button
                          className="flex items-center justify-center button button-primary"
                          onClick={handleClickJoinForum}
                        >
                          <>
                            <FaLock className="mr-2" /> Join Discussion Forum
                          </>
                        </button>
                      )}
                    </div>
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

            {(data.videos || movieImages) && (
              <Media
                videos={data.videos?.results}
                posters={movieImages?.posters}
                backdrops={movieImages?.backdrops}
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

        {/* {type === 'collection' && (
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
        )} */}

        {data && type === 'moviePerson' && (
          <div>
            <div
              className={clsx(
                'flex my-5 gap-12 md:gap-20 lg:flex-row',
                type === 'moviePerson' ? 'flex-col' : 'flex-col-reverse'
              )}
            >
              <div className="lg:w-1/2">
                <div className="aspect-poster">
                  <img
                    src={
                      data[0].image_url
                      // ? `https://image.tmdb.org/t/p/w780${data.profile_path}`
                      // : '/placeholder.svg'
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
                {data[0].biography && (
                  <div>
                    <h2 className="heading">Biography</h2>
                    <p className="text-white-65">{data[0].biography}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  {/* {data.known_for_department && (
                    <p>
                      <span className="text-sm text-white-30">Known for</span>
                      <span className="block mt-2">
                        {data.known_for_department}
                      </span>
                    </p>
                  )} */}

                  {data[0].date_of_birth && (
                    <p>
                      <span className="text-sm text-white-30">Birthday</span>
                      <span className="block mt-2">
                        {format(
                          new Date(data[0].date_of_birth),
                          'dd MMMM, yyyy'
                        )}
                      </span>
                    </p>
                  )}

                  {data[0].place_of_birth && (
                    <p>
                      <span className="text-sm text-white-30">
                        Place of Birth
                      </span>
                      <span className="block mt-2">
                        {data[0].place_of_birth}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* {data.images.profiles.length > 1 && (
              <div>
                <h3 className="heading mb-4">Images</h3>
                <Profiles profiles={data.images.profiles} />
              </div>
            )} */}

            <div className="space-y-4">
              {/* {data.known_for_department === 'Directing' && (
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
              )} */}
              {data[0].movies?.length > 0 && (
                <div>
                  <h3 className="heading mb-4">
                    Movie Credits ({data[0].movies.length})
                  </h3>
                  <ScrollContent className="gap-4">
                    {data[0].movies?.map((credit) => (
                      <Card
                        key={credit.id}
                        id={credit.id}
                        image={credit.poster_url}
                        title={credit.title}
                        type="movie"
                        rating={credit.rating}
                        className="w-64 flex-shrink-0"
                      />
                    ))}
                  </ScrollContent>
                </div>
              )}
              {/* {data.tv_credits?.cast?.length > 0 && (
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
              )} */}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  // const response = await tmdb.get(`/${params.type}/${params.id}`, {
  //   params: {
  //     append_to_response: 'credits,videos,images,tv_credits,recommendations',
  //   },
  // })

  const params = context.params
  const cookie = context.req.headers.cookie

  let response = ''
  let casts = ''

  if (params.type === 'movie') {
    response = await fetch(`http://localhost:4000/v1/movie/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      credentials: 'include',
    }).then((res) => res.json())

    casts = await fetch(`http://localhost:4000/v1/movie/${params.id}/casts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      credentials: 'include',
    }).then((res) => res.json())
  } else if (params.type === 'moviePerson') {
    response = await fetch(
      `http://localhost:4000/v1/moviePerson/${params.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        credentials: 'include',
      }
    ).then((res) => res.json())
    casts = response
  }

  return {
    props: {
      type: params.type,
      data: response,
      casts: casts,
    },
  }
}
