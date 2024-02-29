import React from 'react'
import { Button, Flex, Icon, Image, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { BsFillPeopleFill } from 'react-icons/bs'
import { IoPeopleCircleOutline } from 'react-icons/io5'

const ForumItem = ({ Forum, isJoined, onJoinOrLeaveForum }) => {
  const router = useRouter()

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
        <Text fontSize={16}>{Forum.title}</Text>
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
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation() // stop the event from bubbling up
          onJoinOrLeaveForum(Forum, isJoined)
        }}
      >
        {isJoined ? 'Leave Forum' : 'Join Forum'}
      </Button>
    </Stack>
  )
}
