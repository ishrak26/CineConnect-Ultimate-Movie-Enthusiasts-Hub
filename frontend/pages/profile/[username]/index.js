import React from 'react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '@components/Sidebar'
import BaseLayout from '@components/BaseLayout'
import Navbar from '@components/navbar'
import Container from '@components/Container'
import Row from '@components/Row'
import ForumRow from '@components/ForumRow'
import ReviewCard from '@components/ReviewCard'
import CinefellowsRow from '@components/CinefellowsRow' // Adjust the import path as necessary
import {
  EditButton,
  AcceptCinefellowRequestButton,
  DeclineCinefellowRequestButton,
  SendCinefellowRequestButton,
  RemoveCinefellowButton,
  WithdrawCinefellowRequestButton,
} from '@components/cinefellowProfileButtons'
import Footer from '@components/footer'
import Recommendations from '@components/recommendations'
import { Box, Typography } from '@mui/material' // Import from MUI
// import styles from '../styles/profile.module.css';
// Adjust the path according to your file structure

// import Awards from '@components/Awards'; // Assuming you have this component
// import Activities from '@components/Activities'; // Assuming you have this component

export default function Profile({
  watchedMovies,
  watchlist,
  reviews,
  forums,
  cineFellows,
  userType,
  profileInfo,
  cinefellowCount,
  user,
  cookie,
}) {
  // 1 - user's own profile, 2 - cinefellow, 3 - request sent by profileholder,
  // 4 - request received from profileholder, 5 - non-cinefellow, 6 - unauthenticated
  // Assuming we have the user data for now as static content
  // console.log('Inside Profile: forums', forums);
  const [profileOwnerState, setProfileOwnerState] = useState(userType)
  useEffect(() => {
    // Function to fetch updated profile information based on new state
    const fetchUpdatedProfileInfo = async () => {
      // console.log('Fetching updated profile information');
    }

    fetchUpdatedProfileInfo()
  }, [profileOwnerState])

  const router = useRouter()
  const userData = {
    bio: 'Anime and movie enthusiast. Love to watch and discuss movies!',
    // Other user data can be included here
  }
  const userReviews = [
    {
      movieImage: 'https://via.placeholder.com/150', // Replace with actual image source
      movieName: 'Inception',
      rating: 5,
      timestamp: '2 days ago',
      content:
        'Inception is a great movie. I loved the plot and the acting. The visuals were stunning. Would recommend to anyone who loves a good thriller.',
    },
    {
      movieImage: 'https://via.placeholder.com/150', // Replace with actual image source
      movieName: 'The Dark Knight',
      rating: 5,
      timestamp: '5 days ago',
      content:
        "The Dark Knight is a masterpiece. Heath Ledger's performance as the Joker is iconic. The movie is a must-watch for any movie lover.Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    },
  ] // Assuming we have the user's reviews as static content

  // Function to create section headers with the same style as in Container component
  const SectionHeader = ({ title }) => (
    <Box
      sx={{
        position: 'relative',
        paddingX: { xs: '20px', md: 0 },
        maxWidth: '1366px',
        width: '100%',
        color: '#fff',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: { xs: '20px', md: '0' },
          top: '100%',
          height: '5px',
          width: '100px',
          backgroundColor: 'primary.main',
        },
        marginBottom: '2rem', // Adjust the margin as needed
      }}
    >
      <Typography variant="h5" fontWeight="700" textTransform="uppercase">
        {title}
      </Typography>
    </Box>
  )

  const handleEditProfile = () => {
    router.push(`/profile/${user.username}/edit`)
  }

  const handleUnfollow = async (user, fellow) => {
    console.log('Inside handleUnfollow, user:', user, 'fellow:', fellow)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${fellow.username}/cinefellows/unfollow`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id, // Assuming you need to send both user and fellow IDs
            fellowId: fellow.id,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Failed to unfollow')
      }
      console.log('Should have unfollowed')
      console.log(data.message) // Handle success
      setProfileOwnerState(5) // Update state to reflect the new profile owner state
    } catch (err) {
      console.error(err) // Handle errors
    }
  }

  const handleFollow = async (user, fellow) => {
    console.log('Inside handleFollow, user:', user, 'fellow:', fellow)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${fellow.username}/cinefellows/follow`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id, // Assuming you need to send both user and fellow IDs
            fellowId: fellow.id,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Failed to send follow request')
      }
      console.log('Follow request should have been sent')
      console.log(data.message) // Handle success
      setProfileOwnerState(4) // Update state to reflect the new profile owner state
    } catch (err) {
      console.error(err) // Handle errors
    }
  }

  const handleAcceptRequest = async (user, fellow) => {
    console.log('Inside handleAcceptRequest, user:', user, 'fellow:', fellow)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${fellow.username}/cinefellows/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id, // Assuming you need to send both user and fellow IDs
            fellowId: fellow.id,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Failed to accept follow request')
      }
      console.log('Follow request should have been accepted')
      console.log(data.message) // Handle success
      setProfileOwnerState(2) // Update state to reflect the new profile owner state
    } catch (err) {
      console.error(err) // Handle errors
    }
  }

  const handleRejectRequest = async (user, fellow) => {
    console.log('Inside handleRejectRequest, user:', user, 'fellow:', fellow)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${fellow.username}/cinefellows/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: user.id, // Assuming you need to send both user and fellow IDs
            fellowId: fellow.id,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Failed to reject follow request')
      }
      console.log('Follow request should have been rejected')
      console.log(data.message) // Handle success
      setProfileOwnerState(5) // Update the profileOwnerState to reflect the change
    } catch (err) {
      console.error(err) // Handle errors
    }
  }

  const handleWithdrawRequest = async (user, fellow) => {
    console.log('Inside handleWithdrawRequest, user:', user, 'fellow:', fellow)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${fellow.username}/cinefellows/withdraw-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          // Ensure you're passing necessary information if required by your backend API
          body: JSON.stringify({
            userId: user.id,
            fellowId: fellow.id,
          }),
        }
      )
      console.log('response: ', response)
      if (!response.ok) {
        throw new Error('Failed to withdraw the already sent follow request')
      }
      const data = await response.json()
      console.log('Follow request should have been withdrawn')
      console.log(data.message) // Handle success
      setProfileOwnerState(5) // or another appropriate state based on your app's logic
      console.log(
        'Inside handlerWithdraw function, state : ',
        profileOwnerState
      )
    } catch (err) {
      console.error(err) // Handle errors
    }
  }

  // Spacing classes for margin
  const sectionMargin = 'mb-20 mt-16' // Margin at the bottom of each section

  return (
    <div>
      <Head>
        <title>Profile &mdash; CineConnect</title>
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
          <main className="flex-grow p-4">
            <div
              className={`user-profile-details flex items-end ${sectionMargin}`}
            >
              <img
                src={profileInfo.image_url}
                alt={`${profileInfo.username}'s profile`}
                className="rounded-full h-64 w-64 mr-8 object-cover" // Adjust h-32 and w-32 to the size you desire
              />
              <div className="flex-grow">
                <h1 className="text-4xl font-bold mb-1">
                  {profileInfo.full_name}
                </h1>
                {cinefellowCount < 2 && <p>{cinefellowCount} Cinefellow</p>}
                {cinefellowCount >= 2 && <p>{cinefellowCount} Cinefellows</p>}
                <p className="text-gray-400 italic mt-4">{userData.bio}</p>
              </div>
              {profileOwnerState === 1 ? ( // If the user is the owner of the profile
                <EditButton onClick={() => handleEditProfile()} />
              ) : profileOwnerState === 2 ? ( // If the user is a cinefellow of the profile owner
                <RemoveCinefellowButton
                  onClick={() => handleUnfollow(user, profileInfo)}
                />
              ) : profileOwnerState === 3 ? ( // If the user has been sent a request by the profile owner
                <div style={{ display: 'flex', gap: '10px' }}>
                  <AcceptCinefellowRequestButton
                    onClick={() => handleAcceptRequest(user, profileInfo)}
                  />
                  <DeclineCinefellowRequestButton
                    onClick={() => handleRejectRequest(user, profileInfo)}
                  />
                </div>
              ) : profileOwnerState === 4 ? ( // If the user has sent a request to the profile owner
                <WithdrawCinefellowRequestButton
                  onClick={() => handleWithdrawRequest(user, profileInfo)}
                />
              ) : profileOwnerState === 5 ? ( // If profile owner is someone else
                <SendCinefellowRequestButton
                  onClick={() => handleFollow(user, profileInfo)}
                />
              ) : (
                <></>
              )}
            </div>

            {/* Watched Section */}
            <SectionHeader title="Watched" />
            <div className={`${sectionMargin}`}>
              <Row movies={watchedMovies} isMain={true} />
            </div>

            {/* Watchlist Section */}
            <SectionHeader title="Watchlist" />
            <div className={`${sectionMargin}`}>
              <Row movies={watchlist} isMain={true} />
            </div>

            {/* Reviews Section */}
            <SectionHeader title="Recent Reviews" />
            <div className={`space-y-4 ${sectionMargin}`}>
              {userReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>

            {/* Discussion Forums Section */}
            <SectionHeader title="Discussion Forums" />
            <div className={`${sectionMargin}`}>
              <ForumRow movies={forums.movies} isMain={true} />
            </div>

            {/* cineFellows Section */}
            <SectionHeader title="Cinefellows" />
            <div
              className={`rounded-full h-64 w-64 mr-8 object-cover ${sectionMargin}`}
            >
              <CinefellowsRow cinefellows={cineFellows} />
            </div>
          </main>
          <aside className="w-1/4">
            {/* Place for Recommendations, Awards, Activities */}
          </aside>
        </div>
        <Footer />
      </BaseLayout>
    </div>
  )
}

// You will need to fetch the userData and other props for the component, potentially using getServerSideProps or getStaticProps

export async function getServerSideProps(context) {
  const username = context.params.username
  const { params } = context // Destructure params from context
  //   const { username } = params; // Now you can access username directly from params
  const query = context.query // Get the query parameters
  const cookie = context.req.headers.cookie
  // console.log("Current sesisons user id: ", context.req)

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
    const [
      watchedMovies,
      cineFellows,
      watchlist,
      reviews,
      forums,
      userType,
      profileInfo,
      cinefellowCount,
      user,
    ] = await Promise.all([
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${username}/watched/`
      ),
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${username}/cinefellows/`
      ),
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${username}/watchlist/`
      ),
      fetchData(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/movies/`), // dummy, will need to change to fetch top few reviews
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${username}/joined-forums/`
      ), // dummy, will need to change to fetch top forums
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${username}/identify-profile`
      ),
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${username}/`
      ),
      fetchData(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${username}/cinefellows/count/`
      ),
      fetchData(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/isLoggedIn`),
    ])

    // console.log('user', user)
    // console.log('fellow', profileInfo)
    // console.log('usertype', userType)
    // console.log('watchedMovies', watchedMovies)
    // console.log('cineFellows', cineFellows)
    // console.log('watchlist', watchlist)
    // console.log('reviews', reviews)
    // console.log('forums', forums)
    // console.log('userType', userType)
    // console.log('profileInfo', profileInfo)
    // console.log('cinefellowCount', cinefellowCount)

    // // console.log(username)
    // console.log('User', user);

    // Check if any of the responses indicate 'not found'
    if (
      watchedMovies.notFound ||
      watchlist.notFound ||
      reviews.notFound ||
      forums.notFound ||
      cineFellows.notFound ||
      userType.notFound ||
      profileInfo.notFound ||
      user.notFound
    ) {
      return { notFound: true }
    }

    return {
      props: {
        ...watchedMovies,
        ...watchlist,
        reviews,
        forums,
        ...cineFellows,
        ...userType,
        ...profileInfo,
        ...cinefellowCount,
        ...user,
        cookie,
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
