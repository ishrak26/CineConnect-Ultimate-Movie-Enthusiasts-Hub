import React, { useState } from 'react';
// import { firestore, storage } from '@/firebase/clientApp';
import useCustomToast from '@/hooks/useCustomToast';
import useSelectFile from '@/hooks/useSelectFile';
import { Alert, AlertIcon, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
// import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
// import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import ImageUpload from './PostForm/ImageUpload';
import TextInputs from './PostForm/TextInputs';
import TabItem from './TabItem';

const formTabs = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images',
    icon: IoImageOutline,
  },
];

const NewPostForm = ({ user, communityImageURL, currentCommunity }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const { selectedFile, onSelectFile } = useSelectFile(3000, 3000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const showToast = useCustomToast();
  const communityLink = `/community/${currentCommunity?.id}`;

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    const newPost = {
      communityId: communityId,
      communityImageURL: communityImageURL || '',
      creatorId: user?.uid,
      creatorUsername: user.email.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createTime: serverTimestamp(),
    };

    setLoading(true);

    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      router.push(communityLink);
    } catch (error) {
      console.error('Error creating post: ', error);
      showToast({
        title: 'Post not Created',
        description: 'There was an error creating your post',
        status: 'error',
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onTextChange = (event) => {
    const { name, value } = event.target;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={10} mt={2} shadow="md">
      <TabList
        formTabs={formTabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <BackToCommunityButton communityId={currentCommunity?.id} />
      <PostBody
        selectedTab={selectedTab}
        handleCreatePost={handleCreatePost}
        onTextChange={onTextChange}
        loading={loading}
        textInputs={textInputs}
        selectedFile={selectedFile}
        onSelectFile={onSelectFile}
        setSelectedTab={setSelectedTab}
        setSelectedFile={setSelectedFile}
      />
      <PostCreateError error={error} />
    </Flex>
  );
};
export default NewPostForm;

// TabList.js
import React from 'react';
import { Stack } from '@chakra-ui/react';
import TabItem from './TabItem';

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
  );
};

// BackToCommunityButton.js
import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';

const BackToCommunityButton = ({ communityId }) => {
  const router = useRouter();
  const communityLink = `/community/${communityId}`;

  return (
    <Button
      variant="outline"
      mt={4}
      ml={4}
      mr={4}
      justifyContent="left"
      width="fit-content"
      onClick={() => router.push(communityLink)}
    >
      <Icon as={MdOutlineArrowBackIos} mr={2} />
      {`Back to ${communityId}`}
    </Button>
  );
};

// PostBody.js
import React from 'react';
import { Flex } from '@chakra-ui/react';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';

const PostBody = ({
  selectedTab,
  handleCreatePost,
  onTextChange,
  loading,
  textInputs,
  selectedFile,
  onSelectFile,
  setSelectedTab,
  setSelectedFile,
}) => {
  return (
    <Flex p={4}>
      {selectedTab === "Post" ? (
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
          setSelectedFile={setSelectedFile}
        />
      )}
    </Flex>
  );
};

// PostCreateError.js
import React from 'react';
import { Alert, AlertIcon, Text } from '@chakra-ui/react';

const PostCreateError = ({ error }) => {
  return error && (
    <Alert status="error">
      <AlertIcon />
      <Text mr={2} fontWeight={600} color="red.500">
        There has been an error when creating your post
      </Text>
    </Alert>
  );
};

export { TabList, BackToCommunityButton, PostBody, PostCreateError };

