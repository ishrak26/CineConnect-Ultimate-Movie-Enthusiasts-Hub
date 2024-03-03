import About from '@/components/forum/About'
import CreatePostLink from '@/components/forum/CreatePostLink'
// import Header from "@/components/forum/Header";
// import NotFound from "@/components/forum/NotFound";
import PageContent from '@/components/forum/PageContent'
import Posts from '@/components/forum/Posts'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import safeJsonStringify from 'safe-json-stringify'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@theme/theme'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import ForumHeader from '@components/forum/ForumHeader'

const ForumPage = ({ ForumData, user, members, ForumAbout, cookie }) => {
  //   const setForumStateValue = useSetRecoilState(ForumState);
  const setForumStateValue = []

  // useEffect(() => {
  //   if (ForumData) {
  //     setForumStateValue((prev) => ({
  //       ...prev,
  //       currentForum: ForumData,
  //     }));
  //   }
  // }, [ForumData, setForumStateValue]);

  if (!ForumData || Object.keys(ForumData).length === 0) {
    // return <NotFound />;
  }

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
          <ForumHeader ForumData={ForumAbout} />
          <PageContent>
            <>
              {/* <CreatePostLink /> */}
              <Posts
                ForumData={ForumData}
                user={user}
                ForumAbout={ForumAbout}
                cookie={cookie}
              />
            </>
            <>
              <About ForumData={ForumAbout} members={members} />
            </>
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
    const limit = 9
    const offset = (context.query.page - 1) * limit || 0

    const forumId = context.params.forumId

    const response = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/posts?limit=${limit}&offset=${offset}`
    )
    const members = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/totalMembers`
    )
    const user = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/user`
    )
    const ForumAbout = await fetchData(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}`
    )

    if (response.status === 404) {
      return {
        notFound: true,
      }
    }

    if (response.success === false) {
      return {
        props: {
          error: {
            statusCode: response.status,
            statusMessage: response.errors[0] || response.status_message,
          },
        },
      }
    }

    return {
      props: {
        ForumData: response,
        user: user,
        members: members,
        ForumAbout: ForumAbout,
        cookie: cookie,
        //   query,
      },
    }
  } catch (error) {
    console.log('Error: getServerSideProps', error)
    return { props: {} }
  }
}

export default ForumPage
