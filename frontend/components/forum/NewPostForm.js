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
import getFileExtensionFromDataURL from '../../utils/getFileExtensionFromDataURL'

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

const NewPostForm = ({ user, currentForum, cookie }) => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  })
  const { selectedFile, onSelectFile } = useSelectFile(3000, 3000)
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
      // console.log(cookie)
      const response = await fetch(
        `http://localhost:4000/v1/forum/${forumId}/submit`,
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
      // const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
      if (selectedFile) {
        // console.log('selectedFile', selectedFile)
        const fileExtension = getFileExtensionFromDataURL(selectedFile)
        // console.log('fileExtension', fileExtension) // Output: jpg, png, gif, etc., or 'unknown'

        const imageUrlResponse = await fetch(
          `http://localhost:4000/v1/forum/${forumId}/submitImageUrl`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(cookie ? { Cookie: cookie } : {}),
            },
            credentials: 'include',
            body: JSON.stringify({ extension: fileExtension }),
          }
        )
        if (imageUrlResponse.ok) {
          const imageUrl = await imageUrlResponse.json()
          console.log('imageUrl', imageUrl)
        }

        // const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        // await uploadString(imageRef, selectedFile, 'data_url');
        // const downloadURL = await getDownloadURL(imageRef);
        // await updateDoc(postDocRef, {
        //   imageURL: downloadURL,
        // });
      }
      // router.push(ForumLink)
    } catch (error) {
      console.error('Error creating post: ', error)
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
