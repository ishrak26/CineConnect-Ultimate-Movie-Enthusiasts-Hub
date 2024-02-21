// import { firestore } from "@/firebase/clientApp";
import useCustomToast from '../../hooks/useCustomToast'
import {
  Box,
  Divider,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'
import router from 'next/router'

const Comments = ({ user, selectedPost, ForumId, Comments }) => {
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [createLoading, setCreateLoading] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState('')
  // const setPostState = useSetRecoilState(postState); // If you were using Recoil state management, replace this with your state management logic
  const showToast = useCustomToast()

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/v1/forum/${ForumId}/post/${selectedPost.postId}/comments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.log('Error: fetchComments', error)
      showToast({
        title: 'Comments not Fetched',
        description: 'There was an error fetching comments',
        status: 'error',
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const onCreateComment = async () => {
    setCreateLoading(true)
    try {
      const newComment = {
        // id: commentDocRef.id,
        // creatorId: user.uid,
        // creatorDisplayText: user.email.split('@')[0],
        // ForumId,
        // postId: selectedPost.id,
        // postTitle: selectedPost.title,
        content: commentText,
        images: [],
        // createdAt: serverTimestamp(),
      } // create new comment object with data to be stored in firestore

      setCommentText('') // once comment is submitted clear comment box
      setComments((prev) => [newComment, ...prev]) // display new comment along with old comments after it

      const response = await fetch(
        `http://localhost:4000/v1/forum/${ForumId}/post/${selectedPost.postId}/comment/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
          body: JSON.stringify(newComment),
        }
      )

      // const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
      // if (selectedFile) {
      //   const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
      //   await uploadString(imageRef, selectedFile, 'data_url');
      //   const downloadURL = await getDownloadURL(imageRef);
      //   await updateDoc(postDocRef, {
      //     imageURL: downloadURL,
      //   });
      // }

      fetchComments()

      showToast({
        title: 'Comment Created',
        description: 'Your comment has been created',
        status: 'success',
      })
    } catch (error) {
      console.log('Error: OnCreateComment', error)
      showToast({
        title: 'Comment not Created',
        description: 'There was an error creating your comment',
        status: 'error',
      })
    } finally {
      setCreateLoading(false)
    }
  }

  const onDeleteComment = async (comment) => {
    setLoadingDelete(comment.id)
    try {
      const batch = writeBatch(firestore)

      const commentDocRef = doc(firestore, 'comments', comment.id) // get comment document
      batch.delete(commentDocRef) // delete comment document

      const postDocRef = doc(firestore, 'posts', selectedPost.id) // get post document
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      }) // update number of comments in post document

      await batch.commit()

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost.numberOfComments - 1,
        },
      })) // update number of comments in post state

      setComments((prev) => prev.filter((item) => item.id !== comment.id)) // remove comment from comments state

      showToast({
        title: 'Comment Deleted',
        description: 'Your comment has been deleted',
        status: 'success',
      })
    } catch (error) {
      console.log('Error: onDeleteComment', error)
      showToast({
        title: 'Comment not Deleted',
        description: 'There was an error deleting your comment',
        status: 'error',
      })
    } finally {
      setLoadingDelete('')
    }
  }

  const getPostComments = async () => {
    try {
      setComments(Comments)
    } catch (error) {
      console.log('Error: getPostComments', error)
      showToast({
        title: 'Comments not Fetched',
        description: 'There was an error fetching comments',
        status: 'error',
      })
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (selectedPost) {
      getPostComments()
    }
  }, [selectedPost])

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="gray.50"
      bg="#1a1a1b"
      borderRadius={10}
      pt={4}
      shadow="md"
    >
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
        />
      </Flex>
      <Stack spacing={4} m={4} ml={10}>
        {fetchLoading ? (
          <>
            {[0, 1, 2, 3].map((item) => (
              <Box key={item} padding="6" bg="#1a1a1b">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={3} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex direction="column" justify="center" align="center" p={20}>
                <Text fontWeight={600} opacity={0.3}>
                  {' '}
                  No Comments
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.postId}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDelete === comment.postId}
                    userId={user.userId}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Flex>
  )
}

export default Comments
