import useCustomToast from '../../hooks/useCustomToast'
import {
  Button,
  Flex,
  Icon,
  Image,
  Link,
  // Skeleton,
  Stack,
  Text,
  useClipboard,
  // useToast,
} from '@chakra-ui/react'
// import { set } from 'date-fns'
// import { de } from 'date-fns/locale'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
// import { BsBookmark } from 'react-icons/bs'
// import { FiShare2 } from 'react-icons/fi'
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoPeopleCircleOutline,
} from 'react-icons/io5'
import { MdOutlineDelete } from 'react-icons/md'
// import { number } from 'sharp/lib/is'
// import PostItemError from "../atoms/ErrorMessage";

const PostItem = ({
  post,
  forumId,
  userIsCreator,
  userVoteValue,
  onVote,
  // onDeletePost,
  onSelectPost,
  // showForumImage,
  numberOfComments,
  // cookie,
}) => {
  const [loadingImage, setLoadingImage] = useState(true)
  const [error, setError] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [commentCount, setCommentCount] = useState(numberOfComments)
  const router = useRouter()
  const showToast = useCustomToast()
  const { onCopy, value, setValue, hasCopied } = useClipboard('')

  const singlePostPage = onSelectPost

  useEffect(() => {
    const getCommentCount = async (forumId, postId) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/post/${postId}/reactions`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )
      const data = await response.json() // Convert the response to JSON

      setCommentCount(data.total_comments)
    }

    getCommentCount(forumId, post.postId)
  }, [forumId, post.postId])

  const handleDelete = async (event) => {
    event.stopPropagation()
    setLoadingDelete(true)
    try {
      const success = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/post/${post.postId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      if (!success.ok) {
        throw new Error('Post could not be deleted')
      }

      showToast({
        title: 'Post Deleted',
        description: 'Your post has been deleted',
        status: 'success',
      })

      router.push(`/forum/${forumId}`)
    } catch (error) {
      setError(error.message)
      showToast({
        title: 'Post not Deleted',
        description: 'There was an error deleting your post',
        status: 'error',
      })
    } finally {
      setLoadingDelete(false)
    }
  }

  const handleShare = (event) => {
    event.stopPropagation()
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const postLink = `${baseUrl}/forum/${forumId}/comments/${post.postId}`
    setValue(postLink)
    onCopy()

    showToast({
      title: 'Link Copied',
      description: 'Link to the post has been saved to your clipboard',
      status: 'info',
    })
  }

  const handleSave = (event) => {
    event.stopPropagation()

    showToast({
      title: 'Functionality Coming Soon',
      description: 'Currently, this functionality is not available',
      status: 'warning',
    })
  }

  const handleEdit = (event) => {
    event.stopPropagation()

    router.push(`/forum/${forumId}/post/${post.postId}/edit`)
  }

  return (
    <Flex
      border="1px solid"
      bg="#1a1a1b"
      borderColor="gray.300"
      borderRadius={10}
      _hover={{
        borderColor: singlePostPage ? 'none' : 'gray.400',
        boxShadow: !singlePostPage && 'xl',
      }}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      onClick={() => onSelectPost && onSelectPost(post, forumId)} // if a post is selected then open post
      shadow="md"
    >
      {/* Left Section */}
      <Flex
        direction="column"
        align="center"
        bg={singlePostPage ? 'black' : 'black'}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? '0' : '10px 0px 0px 10px'}
      >
        <VoteSection
          userVoteValue={userVoteValue}
          // cookie={cookie}
          onVote={onVote}
          post={post}
          forumId={forumId}
        />
      </Flex>

      {/* Right Section  */}
      <Flex direction="column" width="100%">
        <Stack spacing={1} p="10px">
          <PostDetails showForumImage={true} post={post} />
          <PostTitle post={post} />
          <PostBody
            post={post}
            loadingImage={loadingImage}
            setLoadingImage={setLoadingImage}
          />
        </Stack>
        <PostActions
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          loadingDelete={loadingDelete}
          userIsCreator={userIsCreator}
          handleShare={handleShare}
          handleSave={handleSave}
          commentCount={commentCount}
        />
      </Flex>
    </Flex>
  )
}
export default PostItem

const VoteSection = ({ onVote, post, forumId }) => {
  let [voteCount, setVoteCount] = useState(0)
  let [downvoteCount, setDownvoteCount] = useState(0)
  const [isVoted, setIsVoted] = useState(false)
  const [voteType, setVoteType] = useState('')

  useEffect(() => {
    const getVoteCount = async (forumId, postId) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/post/${postId}/reactions`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )
      const data = await response.json() // Convert the response to JSON

      setVoteCount(data.upvotes)
      setDownvoteCount(data.downvotes)
    }

    const checkIfVoted = async (forumId, postId) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/post/${postId}/voted`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )
      const data = await response.json() // Convert the response to JSON

      setIsVoted(data.voted)
      setVoteType(data.type)
    }

    getVoteCount(forumId, post.postId)
    checkIfVoted(forumId, post.postId)
  }, [isVoted, forumId, post.postId])

  const handleClick = async (event, value, isVoted) => {
    event.stopPropagation()

    onVote(event, post.postId, value, forumId, isVoted)

    setIsVoted(!isVoted)

    // let decreased = false

    // if (value === 1 && !isVoted) {
    //   setVoteCount(voteCount + 1)
    //   // setIsVoted(true)
    //   // console.log('voteCount', voteCount)
    // } else if (value === -1 && !isVoted) {
    //   setDownvoteCount(downvoteCount + 1)
    //   // setIsVoted(true)
    //   // console.log('downvoteCount', downvoteCount)
    // } else if (value === 1 && isVoted && voteCount > 0) {
    //   setVoteCount(voteCount - 1)
    //   decreased = true
    //   // console.log('voteCount', voteCount)
    // } else if (value === -1 && isVoted && downvoteCount > 0) {
    //   setDownvoteCount(downvoteCount - 1)
    //   // setIsVoted(false)
    //   decreased = true
    //   // console.log('downvoteCount', downvoteCount)
    // }

    // if (decreased) {
    //   setIsVoted(false)
    // } else {
    //   setIsVoted(true)
    // }
  }

  return (
    <>
      <Icon
        as={
          voteType === 'upvote' ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
        }
        color={voteType === 'upvote' ? '#FDD835' : 'gray.500'}
        fontSize={26}
        cursor="pointer"
        _hover={{ color: '#FBC02D' }}
        onClick={(event) => handleClick(event, 1, isVoted)}
      />
      <Text fontSize="12pt" color="white">
        {voteCount}
      </Text>
      <Icon
        as={
          voteType === 'downvote'
            ? IoArrowDownCircleSharp
            : IoArrowDownCircleOutline
        }
        color={voteType === 'downvote' ? '#FDD835' : 'gray.500'}
        _hover={{ color: '#FBC02D' }}
        fontSize={26}
        cursor="pointer"
        onClick={(event) => handleClick(event, -1, isVoted)}
      />
      <Text fontSize="12pt" color="white">
        {downvoteCount}
      </Text>
    </>
  )
}

const PostDetails = ({ showForumImage, post }) => {
  const topText = `By ${post.author.username} ${moment(
    new Date(post.created_at)
  ).fromNow()}`

  return (
    <Stack direction="row" spacing={0.5} align="center" fontSize="9pt">
      {showForumImage && (
        <>
          {/* {post.topImage ? (
            <Image
              borderRadius="full"
              boxSize="30px"
              src={post.topImage}
              mr={2}
              alt="Forum logo"
            />
          ) : ( */}
          <Icon
            as={IoPeopleCircleOutline}
            mr={1}
            fontSize="18pt"
            color="white"
          />
          {/* )} */}
          <Link href={`/forum/${post.postId}`} isExternal>
            <Text
              fontWeight={700}
              _hover={{ textDecoration: 'underline' }}
              pr={2}
              color="white"
            >
              {/* {post.forumName} */}
            </Text>
          </Link>
        </>
      )}
      <Text fontWeight={500} color="white">
        {topText}
      </Text>
    </Stack>
  )
}

const PostTitle = () => {
  return (
    <Text fontSize="12pt" fontWeight={600} color="white">
      {/* {post.title} */}
    </Text>
  )
}

const PostBody = ({ post, loadingImage, setLoadingImage }) => {
  return (
    <>
      <Text fontSize="12pt" color="white">
        {post.content.split(' ').slice(0, 30).join(' ')}
      </Text>
      {post.topImage && (
        <Flex justify="center" align="center">
          {/* {loadingImage && (
            <Skeleton height="300px" width="100%" borderRadius={10} />
          )} */}
          <Image
            mt={4}
            src={post.topImage}
            alt="Image for post"
            maxHeight="450px"
            maxWidth="100%"
            borderRadius="10px"
            display={loadingImage ? 'none' : 'unset'}
            onLoad={() => setLoadingImage(false)}
            shadow="md"
          />
        </Flex>
      )}
    </>
  )
}

const PostActions = ({
  handleDelete,
  loadingDelete,
  userIsCreator,
  // handleEdit,
  // handleShare,
  // handleSave,
  commentCount,
}) => {
  return (
    <Flex
      ml={1}
      mb={1}
      color="gray.500"
      fontWeight={600}
      direction="row"
      justify="space-between" // Use space-between to distribute space
      align="center" // Align items vertically
      width="100%" // Ensure the Flex container takes full width
    >
      <Flex direction="row">
        {/* <Button onClick={handleShare} className="mr-2">
          <Icon as={FiShare2} mr={2} />
          Share
        </Button> */}

        {/* {userIsCreator && (
          <Button onClick={handleEdit} className="mx-2">
          <Icon as={BsBookmark} mr={2} />
          Edit
        </Button>
        )} */}

        {userIsCreator && (
          <Button
            onClick={handleDelete}
            isLoading={loadingDelete}
            className="mx-2"
          >
            <Icon as={MdOutlineDelete} mr={2} />
            Delete
          </Button>
        )}
      </Flex>

      {/* This Text component is moved outside of the first Flex container and will be pushed to the right */}
      <Text mr={10} fontSize="sm">{`${commentCount} Comments`}</Text>
    </Flex>
  )
}
