import { Box, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
// import ForumSettingsModal from "../Modal/ForumSettings/ForumSettings";

const About = ({ ForumData, members }) => {
  const router = useRouter()

  return (
    <Box position="sticky" top="60px" borderRadius={10} shadow="md">
      <AboutHeaderBar ForumName={ForumData.title} />

      <Flex
        direction="column"
        p={3}
        bg="white"
        borderRadius="0px 0px 10px 10px"
      >
        <Stack>
          <AboutForum ForumData={ForumData} members={members} />
          <Button
            width="100%"
            onClick={() => {
              router.push(`/forum/${ForumData.id}/submit`)
            }}
          >
            Create Post
          </Button>
          {/* <AdminSectionAbout ForumData={ForumData} /> */}
        </Stack>
      </Flex>
    </Box>
  )
}

export default About

const AboutHeaderBar = ({ ForumName }) => (
  <Flex
    justify="space-between"
    align="center"
    bg="#FBC02D"
    color="black"
    p={3}
    borderRadius="10px 10px 0px 0px"
  >
    <Text fontSize="10pt" fontWeight={700}>
      About {ForumName}
    </Text>
    <Icon as={HiOutlineDotsHorizontal} />
  </Flex>
)

const AboutForum = ({ ForumData, members }) => (
  
  <Flex width="100%" p={2} fontSize="10pt">
    <Flex direction="column" flexGrow={1}>
      <Text fontWeight={700}>Subscribers</Text>
      <Text>{members.memberCount.toLocaleString()}</Text>
    </Flex>
    <Flex direction="column" flexGrow={1}>
      <Text fontWeight={700}>Created</Text>
      <Text>{ForumData.createdAt}</Text>
    </Flex>
  </Flex>
)

const AdminSectionAbout = ({ ForumData }) => {
  const [isForumSettingsModalOpen, setForumSettingsModalOpen] = useState(false)
  // const [user] = useAuthState(auth)
  const user = []
  return (
    <>
      {user?.uid === ForumData?.creatorId && (
        <>
          <ForumSettingsModal
            open={isForumSettingsModalOpen}
            handleClose={() => setForumSettingsModalOpen(false)}
            ForumData={ForumData}
          />
          <Button
            width="100%"
            variant="outline"
            onClick={() => setForumSettingsModalOpen(true)}
          >
            Forum Settings
          </Button>
        </>
      )}
    </>
  )
}
