// import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useRouter } from 'next/router'
import useCustomToast from './useCustomToast'
import { authModalState } from '@/context/authModalContext'
import { postState } from '@/context/postContext'
import { useState, useEffect } from 'react'

// function for getting user

const getUser = async () => {
  const userId = await fetch(`http://localhost:4000/v1/forum/user`)
  return userId
}

const usePosts = () => {
 
  const [postStateValue, setPostStateValue] = useRecoilState(postState) // get and set single post
  //   const currentCommunity = useRecoilValue(communityState).currentCommunity;  // get current community
  const setAuthModalState = useSetRecoilState(authModalState)
  const router = useRouter()
  const showToast = useCustomToast()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])

  const updateVote = async (postId, vote) => {
    const response = await fetch(
      `http://localhost:4000/v1/forum/${forumId}/post/${postId}/vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to update vote')
    }
    return await response.json()
  }

  const fetchPosts = async (forumId) => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:4000/v1/forum/${forumId}/posts`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      showToast({
        title: 'Error fetching posts',
        description: error.message,
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const onVote = async (event, postId, vote, forumId) => {
    event.stopPropagation()

    const user = getUser()
    if (!user) {
      setAuthModalState({ open: true, view: 'login' })
      return
    }

    try {
      if (vote === 1) {
        const voteType = 'upvote'
        const upvote = await updateVote(postId, voteType)
      } else if (vote === -1) {
        const voteType = 'downvote'
        const downvote = await updateVote(postId, voteType)
      }
      // Optionally, refetch all posts to update the UI
      const updatedPost = await fetchPosts(forumId)
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.postId === postId ? updatedPost : post))
      )

      // setPostStateValue((prev) => ({
      //   ...prev,
      //   posts: updatedPosts,
      //   postVotes: updatedPostVotes,
      // })) // update posts and post votes state on the ui

      // // allow voting when a post is currently selected
      // if (postStateValue.selectedPost) {
      //   setPostStateValue((prev) => ({
      //     ...prev,
      //     selectedPost: updatedPost,
      //   })) // update selected post
      }
     catch (error) {
      showToast({
        title: 'Could not Vote',
        description: error.message || 'There was an error voting on the post',
        status: 'error',
      })
    }
  }

  //   useEffect(() => {
  //     fetchPosts(forumId);
  //   }, [forumId]);

  const onSelectPost = (post, forumId) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }))
    console.log(post)
    router.push(`/forum/${forumId}/post/${post.postId}/comments`)
  }

  const onDeletePost = async (post, forumId) => {
    try {
      if (post.topImage) {
        const imageRef = ref(storage, `posts/${post.id}/image`)
        await deleteObject(imageRef)
      }

      const response = await fetch(
        `http://localhost:4000/v1/forum/${forumId}/post/${post.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ post }),
        }
      )

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.postId !== post.postId),
      }))

      return true
    } catch (error) {
      showToast({
        title: 'Could not Delete Post',
        description: 'There was an error deleting your post',
        status: 'error',
      })
      return false
    }
  }

  //   const getCommunityPostVotes = async (communityId) => {
  //     const postVotesQuery = query(
  //       collection(firestore, "users", `${user?.uid}/postVotes`),
  //       where("communityId", "==", communityId)
  //     );

  //     const postVoteDocs = await getDocs(postVotesQuery);
  //     const postVotes = postVoteDocs.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setPostStateValue(prev => ({
  //       ...prev,
  //       postVotes: postVotes,
  //     }));
  //   };

  //   useEffect(() => {
  //     if (!user || !currentCommunity?.id) {
  //       return;
  //     }
  //     getCommunityPostVotes(currentCommunity?.id);
  //   }, [user, currentCommunity]);

  // useEffect(() => {
  //   if (!user) {
  //     setPostStateValue((prev) => ({
  //       ...prev,
  //       postVotes: [],
  //     }))
  //   }
  // }, [user])

  return {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onVote,
    onDeletePost,
  }
}

export default usePosts
