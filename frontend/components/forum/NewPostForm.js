import React, { useState } from 'react'
// import { firestore, storage } from '@/firebase/clientApp';
import useCustomToast from '@/hooks/useCustomToast'
import useSelectFile from '@/hooks/useSelectFile'
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react'
// import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
// import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import { MdOutlineArrowBackIos } from 'react-icons/md'
import ImageUpload from './ImageUpload'
import TextInputs from './TextInputs'
import TabItem from './TabItem'
// import getFileExtensionFromDataURL from '../../utils/getFileExtensionFromDataURL'

import supabase from '../../utils/supabaseClient'

const formTabs = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images',
    icon: IoImageOutline,
  },
]

const NewPostForm = ({ currentForum }) => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  })
  const { selectedFile, onSelectFile, originalImage } = useSelectFile(
    3000,
    3000
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const showToast = useCustomToast()
  const ForumLink = `/forum/${currentForum?.forumId}`

  const handleCreatePost = async () => {
    const { forumId } = router.query
    const newPost = {
      // forumId: forumId,
      // ForumImageURL: currentForum?.image_url,
      // creatorId: user?.userId,
      // // creatorUsername: user.email.split('@')[0],
      title: textInputs.title,
      content: textInputs.body,
      // numberOfComments: 0,
      // voteStatus: 0,
      // createTime: serverTimestamp(),
    }

    setLoading(true)

    try {
      // upload image to supabase storage
      if (originalImage) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filePath = `public/${forumId}/${uniquePrefix}-${originalImage.name}`

        const { error } = await supabase.storage
          .from('forum')
          .upload(filePath, originalImage)
        // const { data: uploadData, error } = await supabase.storage
        //   .from('forum')
        //   .upload(filePath, originalImage)

        if (error) {
          // console.error('Error uploading file:', error)
          throw error
        }

        const { data: publicURL } = supabase.storage
          .from('forum')
          .getPublicUrl(filePath)

        newPost.images = [{ image_url: publicURL.publicUrl, caption: '' }]
      }
      // console.log(cookie)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/forum/${forumId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
          body: JSON.stringify(newPost),
        }
      )

      if (response.ok) {
        router.push(ForumLink)
      } else {
        const responseData = await response.json()
        throw new Error(responseData.message)
      }
    } catch (error) {
      // console.error('Error creating post: ', error)
      showToast({
        title: 'Post not Created',
        description: 'There was an error creating your post',
        status: 'error',
      })
      setError(true)
    } finally {
      setLoading(false)
    }

    router.push(ForumLink)
  }

  const onTextChange = (event) => {
    const { name, value } = event.target
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Flex direction="column" bg="#1a1a1b" borderRadius={10} mt={2} shadow="md">
      <TabList
        formTabs={formTabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <BackToForumButton ForumId={currentForum?.forumId} />
      <PostBody
        selectedTab={selectedTab}
        handleCreatePost={handleCreatePost}
        onTextChange={onTextChange}
        loading={loading}
        textInputs={textInputs}
        selectedFile={selectedFile}
        onSelectFile={onSelectFile}
        setSelectedTab={setSelectedTab}
        // setSelectedFile={setSelectedFile}
      />
      <PostCreateError error={error} />
    </Flex>
  )
}
export default NewPostForm

const TabList = ({ formTabs, selectedTab, setSelectedTab }) => {
  return (
    <Stack width="100%" direction="row" spacing={2} p={2}>
      {formTabs.map((item) => (
        <TabItem
          key={item.title}
          item={item}
          selected={item.title === selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ))}
    </Stack>
  )
}

const BackToForumButton = ({ ForumId }) => {
  const router = useRouter()
  const ForumLink = `/forum/${ForumId}`

  return (
    <Button
      variant="outline"
      mt={4}
      ml={4}
      mr={4}
      bg="gray.500"
      justifyContent="left"
      width="fit-content"
      onClick={() => router.push(ForumLink)}
    >
      <Icon as={MdOutlineArrowBackIos} mr={2} />
      {/* {`Back to ${ForumId}`} */}
      {`Back to Forum`}
    </Button>
  )
}

const PostBody = ({
  selectedTab,
  handleCreatePost,
  onTextChange,
  loading,
  textInputs,
  selectedFile,
  onSelectFile,
  setSelectedTab,
  // setSelectedFile,
}) => {
  return (
    <Flex p={4}>
      {selectedTab === 'Post' ? (
        <TextInputs
          textInputs={textInputs}
          handleCreatePost={handleCreatePost}
          onChange={onTextChange}
          loading={loading}
        />
      ) : (
        <ImageUpload
          selectedFile={selectedFile}
          onSelectImage={onSelectFile}
          setSelectedTab={setSelectedTab}
          // setSelectedFile={setSelectedFile}
        />
      )}
    </Flex>
  )
}

const PostCreateError = ({ error }) => {
  return (
    error && (
      <Alert status="error">
        <AlertIcon />
        <Text mr={2} fontWeight={600} color="red.500">
          There has been an error when creating your post
        </Text>
      </Alert>
    )
  )
}

export { TabList, BackToForumButton, PostBody, PostCreateError }
