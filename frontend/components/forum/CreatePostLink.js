import { Flex, Icon, Input } from '@chakra-ui/react'
import React from 'react'
import { BsLink45Deg } from 'react-icons/bs'
import { IoIosCreate } from 'react-icons/io'
import { IoImageOutline } from 'react-icons/io5'

/**
 * Component which redirects the user to the create post page.
 * If the user is not logged in, the authentication modal is opened.
 * @returns Component directing user to the create post page.
 */
const CreatePostLink = () => {
  //   const { onClick } = useCallCreatePost(); // hook for creating a new post
  const onClick = () => {}

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="#1a1a1b"
      height="56px"
      borderRadius={12}
      border="1px solid"
      borderColor="gray.300"
      p={2}
      mb={4}
      shadow="md"
    >
      <Icon as={IoIosCreate} fontSize={36} color="gray.300" mr={4} />
      {/* Input for creating a new post */}
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        color="gray.50"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'black',
          border: '1px solid',
          borderColor: 'black',
        }}
        _focus={{
          outline: 'none',
          bg: '#1a1a1b',
          border: '1px solid',
          borderColor: 'black',
        }}
        bg="#1a1a1b"
        borderColor="gray.200"
        height="36px"
        borderRadius={10}
        mr={4}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  )
}

export default CreatePostLink
