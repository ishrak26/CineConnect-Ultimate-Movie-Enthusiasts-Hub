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
