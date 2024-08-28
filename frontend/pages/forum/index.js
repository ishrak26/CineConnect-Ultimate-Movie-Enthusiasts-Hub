import ForumItem from '@/components/forum/ForumItem'
// import PersonalHome from '@/components/forum/PersonalHome'
import PageContent from '@/components/forum/PageContent'
import ForumLoader from '@/components/forum/ForumLoader'
// import useForumData from "@/hooks/useForumData";
import useCustomToast from '@/hooks/useCustomToast'
import { Button, Flex, Stack } from '@chakra-ui/react'
// import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
// import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@theme/theme'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
// import ForumHeader from '@components/forum/ForumHeader'

// Displays the forums page with the top 5 communities.
// Pressing the "See More" button will display the next 5 communities.
const Forums = ({ user, cookie }) => {
  // const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();
  const [loading, setLoading] = useState(false)
  const [forums, setForums] = useState([])
  // const router = useRouter()
  const showToast = useCustomToast()

  // Gets the top 5 communities with the most members.
  const getForums = async (numberOfExtraPosts) => {
    setLoading(true)
    try {
      const forumsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/profile/${
          user.username
        }/joined-forums?limit=${5 + numberOfExtraPosts}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      const forumsData = await forumsResponse.json()
      // console.log('forumsData', forumsData)
      setForums(forumsData)
    } catch (error) {
      showToast({
        title: 'Could not Find Forums',
        description: 'There was an error getting forums. Please try again.',
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getForums(0)
  }, [])

  return (
    <>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Forums &mdash; CineConnect</title>
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
          <PageContent>
            <>
              <Stack direction="column" borderRadius={10} spacing={3}>
                {loading ? (
                  <Stack mt={2} p={3}>
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <ForumLoader key={index} />
                      ))}
                  </Stack>
                ) : (
                  <>
                    {forums &&
                      forums.forums?.map((forum, index) => {
                        // const isJoined = !!communityStateValue.mySnippets.find(
                        //   (snippet) => snippet.communityId === community.id
                        // );
                        return (
                          <ForumItem
                            key={index}
                            Forum={forum}
                            // isJoined={isJoined}
                            // onJoinOrLeaveCommunity={onJoinOrLeaveCommunity}
                          />
                        )
                      })}
                  </>
                )}
                <Flex
                  p="10px 20px"
                  alignContent="center"
                  justifyContent="center"
                >
                  <Button
                    height="34px"
                    width="200px"
                    onClick={() => {
                      getForums(5)
                    }}
                    shadow="md"
                    isLoading={loading}
                  >
                    View More
                  </Button>
                </Flex>
              </Stack>
            </>
            <Stack spacing={2}>{/* <PersonalHome /> */}</Stack>
            <></>
          </PageContent>
        </BaseLayout>
      </ChakraProvider>
    </>
  )
}

export async function getServerSideProps(context) {
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

  try {
    // const limit = 9
    // const offset = (context.query.page - 1) * limit || 0

    // const response = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/posts?limit=${limit}&offset=${offset}`)
    // const members = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/totalMembers`)
    // const user = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/user`)
    // const ForumAbout = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}`)

    const user = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/isLoggedIn`
    )

    // if (response.status === 404) {
    //   return {
    //     notFound: true,
    //   }
    // }

    // if (response.success === false) {
    //   return {
    //     props: {
    //       error: {
    //         statusCode: response.status,
    //         statusMessage: response.errors[0] || response.status_message,
    //       },
    //     },
    //   }
    // }

    return {
      props: {
        user: user.user,
        cookie: cookie,
        //   query,
      },
    }
  } catch (error) {
    // console.log('Error: getServerSideProps', error)
    return { props: {} }
  }
}

export default Forums
