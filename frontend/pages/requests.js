// requests.js
import React, { useState, useEffect } from 'react'
import Navbar from '@components/navbar'
import Footer from '@components/footer'
import BaseLayout from '@components/BaseLayout'
import { useRouter } from 'next/router'
import Head from 'next/head'
import CinefellowRequestCard from '@components/CinefellowRequestCard'
import Pagination from '@components/pagination'
import { Box, Typography } from '@mui/material' // Import from MUI

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
      marginTop: '3rem', // Adjust the margin as needed
      marginBottom: '3rem', // Adjust the margin as needed
    }}
  >
    <Typography variant="h5" fontWeight="700" textTransform="uppercase">
      {title}
    </Typography>
  </Box>
)

const Requests = ({
  User,
  initialRequests,
  pendingRequestCount,
  initialPage,
  totalPages,
}) => {
  const [requests, setRequests] = useState(initialRequests)
  const [requestStatuses, setRequestStatuses] = useState({})
  const [pendingReqCount, setPendingReqCount] = useState(pendingRequestCount)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async (page) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/requests?page=${page}`
        )
        const data = await res.json()
        setRequests(data.pendingRequests)
        setPendingReqCount(data.pendingRequestCount)
        setCurrentPage(page)
      } catch (error) {
        console.error('Failed to fetch pending requests:', error)
      }
    }

    if (currentPage !== initialPage) {
      fetchRequests(currentPage)
    }
  }, [currentPage, initialPage])

  const handlePageChange = (page) => {
    router.push(`/requests?page=${page}`)
    setCurrentPage(page)
  }

  const handleAcceptRequest = async (requestId) => {
    // console.log("Inside handleAcceptRequest, user:", user, "fellow:", fellow);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/requests/${requestId}/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: User.id,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Failed to accept follow request')
      }
      setRequestStatuses((prevStatuses) => ({
        ...prevStatuses,
        [requestId]: 'accepted',
      }))
      console.log('Follow request should have been accepted')
      console.log(data.message) // Handle success
    } catch (err) {
      console.error(err) // Handle errors
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/requests/${requestId}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: User.id,
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error('Failed to reject follow request')
      }
      setRequestStatuses((prevStatuses) => ({
        ...prevStatuses,
        [requestId]: 'rejected',
      }))
      console.log('Follow request should have been rejected')
      console.log(data.message) // Handle success
    } catch (err) {
      console.error(err) // Handle errors
    }
  }

  return (
    <div>
      <Head>
        <title>Pending Requests &mdash; CineConnect</title>
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
        <div className="container mx-auto px-4">
          <SectionHeader
            title={`Pending Cinefellow Requests (${pendingReqCount})`}
          />
          {requests.map(
            (request) => (
              console.log('Request: ', request),
              (
                <CinefellowRequestCard
                  key={request.id}
                  requestorPhoto={request.requesterDetails.image_url}
                  requestorUsername={request.requesterDetails.full_name}
                  commonForumsCount={request.commonForumsCount}
                  requestedAt={new Date(request.created_at).toLocaleString(
                    'en-US',
                    {
                      month: 'long', // "January"
                      day: '2-digit', // "01"
                      year: 'numeric', // "2024"
                      hour: '2-digit', // "12"
                      minute: '2-digit', // "00"
                      second: '2-digit', // "00"
                      hour12: true, // AM/PM format
                    }
                  )}
                  status={requestStatuses[request.id] || 'pending'}
                  onAccept={() => handleAcceptRequest(request.id)}
                  onReject={() => handleRejectRequest(request.id)}
                />
              )
            )
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </BaseLayout>
      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  const page = context.query.page || 1
  const limit = 10 // Adjust based on your pagination preference
  const cookie = context.req.headers.cookie
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
  try {
    const User = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/isLoggedIn`
    )
    // console.log("User: ", User.user.username);
    // Fetch initial pending requests
    const { pendingRequests, pendingRequestCount } = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/requests?page=${page}&limit=${limit}`
    )

    if (pendingRequests.notFound || pendingRequestCount.notFound) {
      return { notFound: true }
    }
    // console.log('PendingRequests: ', pendingRequests);
    const initialRequests = pendingRequests.incomingRequests || []
    // console.log('InitialRequests: ', initialRequests);
    // console.log('pendingRequestCount: ', pendingRequestCount);
    const totalPages = Math.ceil(pendingRequestCount / limit)

    return {
      props: {
        User,
        initialRequests,
        pendingRequestCount,
        initialPage: parseInt(page, 10),
        totalPages,
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

export default Requests
