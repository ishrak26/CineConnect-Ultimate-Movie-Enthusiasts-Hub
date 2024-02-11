import useCustomToast from '../../hooks/useCustomToast'
import {
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Skeleton,
  Stack,
  Text,
  useClipboard,
  useToast,
} from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { BsBookmark } from 'react-icons/bs'
import { FiShare2 } from 'react-icons/fi'
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoPeopleCircleOutline,
} from 'react-icons/io5'
import { MdOutlineDelete } from 'react-icons/md'
// import PostItemError from "../atoms/ErrorMessage";



const PostItem = ({
  post,
  forumId,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  showForumImage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true)
  const [error, setError] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const router = useRouter()
  const showToast = useCustomToast()
  const { onCopy, value, setValue, hasCopied } = useClipboard('')

  const singlePostPage = !onSelectPost

  const handleDelete = async (event) => {
    event.stopPropagation()
    setLoadingDelete(true)
    try {
      const success = await onDeletePost(post, forumId)

      if (!success) {
        throw new Error('Post could not be deleted')
      }

      showToast({
        title: 'Post Deleted',
        description: 'Your post has been deleted',
        status: 'success',
      })

      if (singlePostPage) {
        router.push(`/forum/${forumId}`)
      }
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
    const postLink = `${baseUrl}/forum/${post.ForumId}/comments/${post.id}`
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

  return (
    <Flex
      border="1px solid"
      bg="white"
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
        bg={singlePostPage ? 'none' : 'gray.100'}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? '0' : '10px 0px 0px 10px'}
      >
        <VoteSection
          userVoteValue={userVoteValue}
          onVote={onVote}
          post={post}
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
          loadingDelete={loadingDelete}
          userIsCreator={userIsCreator}
          handleShare={handleShare}
          handleSave={handleSave}
        />
      </Flex>
    </Flex>
  )
}
export default PostItem

const VoteSection = ({ userVoteValue, onVote, post }) => {
  return (
    <>
      <Icon
        as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
        color={userVoteValue === 1 ? 'black' : 'gray.500'}
        fontSize={22}
        cursor="pointer"
        _hover={{ color: 'black' }}
        onClick={(event) => onVote(event, post, 1, post.ForumId)}
      />
      <Text fontSize="12pt" color="gray.600">
        {post.voteStatus}
      </Text>
      <Icon
        as={
          userVoteValue === -1
            ? IoArrowDownCircleSharp
            : IoArrowDownCircleOutline
        }
        color={userVoteValue === -1 ? 'black' : 'gray.500'}
        _hover={{ color: 'black' }}
        fontSize={22}
        cursor="pointer"
        onClick={(event) => onVote(event, post, -1, forumId)}
      />
    </>
  )
}

const PostDetails = ({ showForumImage, post }) => {

  const topText = `By ${post.author.username} ${moment(new Date(post.created_at)).fromNow()}`;

  console.log(post)

  return (
    <Stack direction="row" spacing={0.5} align="center" fontSize="9pt">
      {showForumImage && (
        <>
          {post.topImage ? (
            <Image
              borderRadius="full"
              boxSize="30px"
              src={post.topImage}
              mr={2}
              alt="Forum logo"
            />
          ) : (
            <Icon
              as={IoPeopleCircleOutline}
              mr={1}
              fontSize="18pt"
              color="black"
            />
          )}
          <Link href={`/forum/${post.postId}`} isExternal>
            <Text
              fontWeight={700}
              _hover={{ textDecoration: 'underline' }}
              pr={2}
            >
              {/* {post.forumName} */}
            </Text>
          </Link>
        </>
      )}
      <Text fontWeight={500}>{topText}</Text>
    </Stack>
  )
}

const PostTitle = ({ post }) => {
  return (
    <Text fontSize="12pt" fontWeight={600}>
      {/* {post.title} */}
    </Text>
  )
}

const PostBody = ({ post, loadingImage, setLoadingImage }) => {
  return (
    <>
      <Text fontSize="12pt">
        {post.content.split(' ').slice(0, 30).join(' ')}
      </Text>
      {post.image_url && (
        <Flex justify="center" align="center">
          {loadingImage && (
            <Skeleton height="300px" width="100%" borderRadius={10} />
          )}
          <Image
            mt={4}
            src={post.image_url}
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
  handleShare,
  handleSave,
}) => {
  return (
    <Flex
      ml={1}
      mb={1}
      color="gray.500"
      fontWeight={600}
      direction="row"
      spacing={1}
    >
      <Button onClick={handleShare} className="mr-2">
        <Icon as={FiShare2} mr={2} />
        Share
      </Button>

      <Button onClick={handleSave} className="mx-2">
        <Icon as={BsBookmark} mr={2} />
        Save
      </Button>

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
  )
}
