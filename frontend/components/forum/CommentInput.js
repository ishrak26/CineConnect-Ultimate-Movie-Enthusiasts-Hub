// import ProfileModal from "@/components/Modal/Profile/ProfileModal";
// import AuthButtons from "@/components/Navbar/RightContent/AuthButtons";
import { Flex, Textarea, Button, Text, Stack } from "@chakra-ui/react";
import React, { useState } from "react";

const CommentInput = ({
  commentText,
  setCommentText,
  user,
  createLoading,
  onCreateComment,
}) => {
  // const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  return (
    <Flex direction="column" position="relative">
      {user ? (
        // If the user is logged in, display the comment input box
        <>
          {/* <ProfileModal
            handleClose={() => setProfileModalOpen(false)}
            open={isProfileModalOpen}
          /> */}
          <Stack direction="row" align="center" spacing={1} mb={2}>
            <Text color="gray.600">Comment as</Text>
            <Text
              color="gray.600"
              fontSize="10pt"
              _hover={{
                cursor: "pointer",
                textDecoration: "underline",
                textColor: "red.500",
              }}
              // onClick={() => setProfileModalOpen(true)}
            >
              {/* {user?.email?.split("@")[0]} */}
            </Text>
          </Stack>

          <Textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Comment"
            fontSize="10pt"
            borderRadius={10}
            minHeight="140px"
            padding={4}
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid red",
            }}
          />

          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 10px 10px"
            zIndex="997"
          >
            <Button
              height="30px"
              disabled={!commentText.length}
              isLoading={createLoading}
              onClick={() => onCreateComment(commentText)}
              zIndex="999"
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        // If the user is not logged in, display the login/signup prompt
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};

export default CommentInput;
