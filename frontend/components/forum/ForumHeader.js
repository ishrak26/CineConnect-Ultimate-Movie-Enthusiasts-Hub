import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HiArrowCircleUp } from 'react-icons/hi'
// import useForumData from "@/hooks/useForumData";
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FiSettings } from 'react-icons/fi'
import IconItem from './Icon'
// import ForumSettingsModal from "../Modal/ForumSettings/ForumSettings";

const ForumHeader = ({ ForumData }) => {
  //   const { ForumStateValue, onJoinOrLeaveForum, loading } = useForumData();

  //   const isJoined = !!ForumStateValue.mySnippets.find(item => item.ForumId === ForumData.id);
  const isJoined = false

  return (
    <Flex direction="column" width="100%" height="120px">
      <Box height="30%" bg="#FBC02D" />
      <Flex justify="center" bg="black" flexGrow={1}>
        <Flex width="95%" maxWidth="1200px" align="center">
          <ForumIcon imageURL={ForumData.image_url} />

          <Flex padding="10px 16px" width="100%">
            <ForumName id={ForumData.title} />
            <Flex direction="row" flexGrow={1} align="end" justify="end">
              {/* <ForumSettings ForumData={ForumData} /> */}
              <JoinOrLeaveButton
                isJoined={isJoined}
                onClick={() => onJoinOrLeaveForum(ForumData, isJoined)}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default ForumHeader

const ForumIcon = ({ imageURL }) => {
  return imageURL ? (
    <Image
      src={imageURL}
      borderRadius="full"
      boxSize="66px"
      alt="Forum icons"
      color="red.500"
      border="3px solid white"
      shadow="md"
    />
  ) : (
    <Icon
      as={HiArrowCircleUp}
      fontSize={64}
      color="red.500"
      border="3px solid white"
      borderRadius="full"
      bg="white"
      shadow="md"
    />
  )
}

const ForumName = ({ id }) => {
  return (
    <Flex direction="column" mr={6}>
      <Text fontWeight={800} fontSize="20pt" color="white">
        {id}
      </Text>
    </Flex>
  )
}

export const JoinOrLeaveButton = ({ isJoined, onClick }) => {
  return (
    <Button
      variant={isJoined ? 'outline' : 'solid'}
      height="30px"
      pr={{ base: 2, md: 6 }}
      pl={{ base: 2, md: 6 }}
      onClick={onClick}
      shadow="md"
      width="120px"
    >
      {isJoined ? 'Unsubscribe' : 'Subscribe'}
    </Button>
  )
}

export const ForumSettings = ({ ForumData }) => {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [isForumSettingsModalOpen, setForumSettingsModalOpen] = useState(false)

  return (
    <>
      {user?.uid === ForumData.creatorId && (
        <>
          <ForumSettingsModal
            open={isForumSettingsModalOpen}
            handleClose={() => setForumSettingsModalOpen(false)}
            ForumData={ForumData}
          />
          <IconItem
            icon={FiSettings}
            fontSize={20}
            onClick={() => setForumSettingsModalOpen(true)}
            iconColor="gray.500"
          />
        </>
      )}
    </>
  )
}
