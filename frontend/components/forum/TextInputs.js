import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react'
import React from 'react'

const TextInputs = ({ textInputs, onChange, handleCreatePost, loading }) => {
  return (
    <Stack spacing={3} width="100%">
      {/* Title of the post */}
      {/* <Input
        name="title"
        placeholder="Title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={10}
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "red.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "red.500",
        }}
      /> */}
      {/* Body of the post */}
      <Textarea
        name="body"
        placeholder="Write your post here..."
        value={textInputs.body}
        onChange={onChange}
        fontSize="10pt"
        height="120px"
        color={'white'}
        borderRadius={10}
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'black',
          border: '1px solid',
          borderColor: 'red.500',
        }}
        _focus={{
          outline: 'none',
          bg: '#1a1a1b',
          border: '1px solid',
          borderColor: 'red.500',
        }}
      />
      <Flex justify="flex-end">
        {/* Button for creating a new post */}
        <Button
          height="34px"
          padding="0px 30px"
          // isDisabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
          shadow="md"
        >
          Post
        </Button>
      </Flex>
    </Stack>
  )
}

export default TextInputs
