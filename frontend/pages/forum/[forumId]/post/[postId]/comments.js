import About from '@/components/forum/About'
import PageContent from '@/components/forum/PageContent'
import PostLoader from '@/components/forum/PostLoader'
import Comments from '@/components/forum/Comments'
import PostItem from '@/components/forum/PostItem'
// import { auth, firestore } from "@/firebase/clientApp";
// import useForumData from "@/hooks/useForumData";
import useCustomToast from '@/hooks/useCustomToast'
import usePosts from '@/hooks/usePosts'
import { Stack } from '@chakra-ui/react'
// import { doc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@theme/theme'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import { number } from 'sharp/lib/is'

const PostPage = ({
  postData,
  postComments,
  votes,
  user,
  ForumAbout,
  forumId,
  members,
}) => {
  const {
    // postStateValue,
    // setPostStateValue,
    onDeletePost,
    onVote,
  } = usePosts()

  //   const { ForumStateValue } = useForumData();
  //   const [user] = useAuthState(auth);
  const router = useRouter()
  const showToast = useCustomToast()
  const [hasFetched, setHasFetched] = useState(false)
  const [postExists, setPostExists] = useState(true)
  const [postLoading, setPostLoading] = useState(false)
  const [numberOfComments, setCommentCount] = useState(postComments.length)

  const postStateValue = {
    selectedPost: postData,
  }

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
            {postLoading ? (
              <PostLoader />
            ) : (
              <>
                <Stack spacing={3} direction="column">
                  {postStateValue.selectedPost && (
                    <PostItem
                      post={postStateValue.selectedPost}
                      forumId={forumId}
                      onVote={onVote}
                      onDeletePost={onDeletePost}
                      userVoteValue={votes}
                      userIsCreator={
                        user === postStateValue.selectedPost?.author.id
                      }
                      showForumImage={true}
                      numberOfComments={numberOfComments}
                    />
                  )}

                  <Comments
                    user={user}
                    selectedPost={postStateValue.selectedPost}
                    ForumId={forumId}
                    Comments={postComments}
                    updateCommentCount={() =>
                      setCommentCount((prevCount) => prevCount + 1)
                    }
                  />
                </Stack>
              </>
            )}
          </>

          <About ForumData={ForumAbout} members={members} />
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
    const limit = 9
    const offset = (context.query.page - 1) * limit || 0

    const forumId = context.params.forumId

    const postId = context.params.postId

    // const response = await fetchData(
    //   `http://localhost:4000/v1/forum/${forumId}/posts?limit=${limit}&offset=${offset}`
    // )
    // const members = await fetchData(
    //   `http://localhost:4000/v1/forum/${forumId}/totalMembers`
    // )
    const user = await fetchData(`http://localhost:4000/v1/forum/user`)
    // const ForumAbout = await fetchData(
    //   `http://localhost:4000/v1/forum/${forumId}`
    // )

    const postData = await fetchData(
      `http://localhost:4000/v1/forum/${forumId}/post/${postId}`
    )
    const postComments = await fetchData(
      `http://localhost:4000/v1/forum/${forumId}/post/${postId}/comments/`
    )
    const votes = await fetchData(
      `http://localhost:4000/v1/forum/${forumId}/post/${postId}/reactions/`
    )
    const ForumAbout = await fetchData(
      `http://localhost:4000/v1/forum/${forumId}`
    )
    const members = await fetchData(
      `http://localhost:4000/v1/forum/${forumId}/totalMembers`
    )

    console.log('postData', postData)
    console.log('comments', postComments)
    console.log('votes', votes)
    console.log('ForumAbout', ForumAbout)

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
        postData: postData,
        postComments: postComments,
        votes: votes,
        user: user,
        ForumAbout: ForumAbout,
        forumId: forumId,
        members: members,
        //   query,
      },
    }
  } catch (error) {
    console.log('Error: getServerSideProps', error)
    return { props: {} }
  }
}

export default PostPage
