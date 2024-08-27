import { Button, Flex, Image, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
// import { useRecoilValue } from "recoil";
// import CreateForumModal from "../Modal/CreateForum/CreateForumModal";
// import { ForumState } from "@/atoms/ForumsAtom";

/**
 * Component for displaying card for creating a new Forum or post.
 * @returns Card for creating a new Forum or post.
 */
const PersonalHome = () => {
  const [open, setOpen] = useState(false) // modal initially closed
  //   const mySnippets = useRecoilValue(ForumState).mySnippets;   // Updates automatically when mySnippets changes
  // const mySnippets = [];

  //   const { onClick } = useCallCreatePost();
  const onClick = () => {}

  return (
    <>
      {/* <CreateForumModal open={open} handleClose={() => setOpen(false)} /> */}
      <Flex
        direction="column"
        bg="white"
        borderRadius={10}
        cursor="pointer"
        border="1px solid"
        borderColor="gray.300"
        position="sticky"
        shadow="md"
      >
        <Flex
          align="flex-end"
          color="white"
          p="6px 10px"
          bg="blue.500"
          height="34px"
          borderRadius="10px 10px 0px 0px"
          fontWeight={600}
          bgImage="url(/small.jpg)"
          backgroundSize="cover"
        ></Flex>
        <Flex direction="column" p="12px">
          <Flex align="center" mb={2}>
            <Image src="/LogoB.png" height="50px" alt="Website logo" mr={2} />
            <Text fontWeight={600} className="mx-10">
              Home
            </Text>
          </Flex>
          <Stack spacing={3}>
            <Text fontSize="9pt">
              Home page personalized based on your subscribed Forums.
            </Text>
            <Button height="30px" onClick={onClick}>
              Create Post
            </Button>
            <Button
              variant="outline"
              height="30px"
              onClick={() => setOpen(true)}
            >
              Create Forum
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </>
  )
}

export default PersonalHome
