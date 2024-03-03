// import { authModalState } from "@/context/authModal";
import About from '@/components/forum/About'
import PageContent from '@/components/forum/PageContent'
// import AuthButtons from "@/components/Navbar/RightContent/AuthButtons";
import NewPostForm from '@/components/forum/NewPostForm'
// import { auth } from "@/firebase/clientApp";
// import useForumData from "@/hooks/useForumData";
import { Box, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@theme/theme'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'

// Post submission page where the user can create a new post.
const SubmitPostPage = ({ user, ForumAbout, members, cookie }) => {
  //   const [user] = useAuthState(auth);
  // Access Forum data using custom hook
  //   const { ForumStateValue } = useForumData();
  // const setAuthModalState = useSetRecoilState(authModalState)

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Post &mdash; CineConnect</title>
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
            <Box p="14px 0px">
              <Text fontSize="20pt" fontWeight={700} color="white">
                Create Post
              </Text>
            </Box>
            {user ? (
              <NewPostForm
                user={user}
                // ForumImageURL={ForumStateValue.currentForum?.image_url}
                currentForum={ForumAbout}
                cookie={cookie}
              />
            ) : (
              <Stack
                justifyContent="center"
                align="center"
                bg="white"
                p={5}
                borderRadius={10}
              >
                <Text fontWeight={600}>Log in or sign up to post</Text>
                <Stack direction="row" spacing={2} ml={4}>
                  {/* <AuthButtons /> */}
                </Stack>
              </Stack>
            )}
          </>
          <>
            <About ForumData={ForumAbout} members={members} />
          </>
        </PageContent>
      </BaseLayout>
    </ChakraProvider>
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
    const forumId = context.params.forumId

    const ForumAbout = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}`
    )
    const members = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/totalMembers`
    )
    const user = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/user`
    )

    // console.log('ForumAbout', ForumAbout)

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
        user: user,
        ForumAbout: ForumAbout,
        members: members,
        cookie,
        //   query,
      },
    }
  } catch (error) {
    console.log('Error: getServerSideProps', error)
    return { props: {} }
  }
}

export default SubmitPostPage
