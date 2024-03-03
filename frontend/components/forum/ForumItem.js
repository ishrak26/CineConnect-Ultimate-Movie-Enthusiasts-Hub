import React from 'react'
import { Button, Flex, Icon, Image, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { BsFillPeopleFill } from 'react-icons/bs'
import { IoPeopleCircleOutline } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import { set } from 'react-nprogress'

const ForumItem = ({ Forum }) => {
  const router = useRouter()

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    const checkIfUserJoinedForum = async () => {
      const response = await fetch(
        `http://localhost:4000/v1/forum/${Forum.movie_id}/joined`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // ...(cookie ? { Cookie: cookie } : {}),
          },
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setIsJoined(data.joined)
      }
    }

    checkIfUserJoinedForum()
  }, [Forum.movie_id, isJoined])

  const onJoinOrLeaveForum = async (Forum, isJoined) => {
    router.push(`/forum/${Forum.id ? Forum.id : Forum.movie_id}`)
  }

  return (
    <Flex
      align="center"
      fontSize="10pt"
      borderColor="white"
      borderWidth="1px"
      p="14px 12px"
      borderRadius={10}
      bg="white"
      _hover={{
        borderColor: 'gray.400',
        boxShadow: 'xl',
      }}
      cursor="pointer"
      onClick={() => {
        router.push(`/forum/${Forum.id ? Forum.id : Forum.movie_id}`)
      }}
      shadow="md"
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        flexGrow={1}
        align="left"
      >
        <ForumItemNameIconSection Forum={Forum} />
        <ForumItemButtonMembersSection
          Forum={Forum}
          onJoinOrLeaveForum={onJoinOrLeaveForum}
          isJoined={isJoined}
        />
      </Stack>
    </Flex>
  )
}

export default ForumItem

const ForumItemNameIconSection = ({ Forum }) => {
  return (
    <Flex align="center" width="100%">
      <Flex align="center" direction="row">
        {Forum.imageURL ? (
          <Image
            src={Forum.imageURL}
            borderRadius="full"
            boxSize="35px"
            mr={4}
            alt="Forum Icon"
          />
        ) : (
          <Icon
            as={IoPeopleCircleOutline}
            fontSize={38}
            color="red.500"
            mr={4}
          />
        )}
        <Text color="black" fontSize={16}>
          {Forum.title}
        </Text>
      </Flex>
    </Flex>
  )
}

const ForumItemButtonMembersSection = ({
  Forum,
  onJoinOrLeaveForum,
  isJoined,
}) => {
  return (
    <Stack direction="row" align="center" justifyContent="space-between">
      <Flex
        fontSize={18}
        color="gray.500"
        justify="center"
        align="center"
        mr={2}
      >
        <Icon as={BsFillPeopleFill} mr={1} />
        {Forum.numberOfMembers ? Forum.numberOfMembers : Forum.member_count}
      </Flex>
      <Button
        height="30px"
        width="130px"
        fontSize="10pt"
        variant={isJoined ? 'outline' : 'solid'}
        onClick={() => onJoinOrLeaveForum(Forum, isJoined)}
      >
        {console.log(isJoined)}
        {isJoined ? 'Go to Forum' : 'Join Forum'}
      </Button>
    </Stack>
  )
}
