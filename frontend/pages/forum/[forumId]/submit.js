import { authModalState } from "@/context/authModal";
import About from "@/components/forum/About";
import PageContent from "@/components/forum/PageContent";
// import AuthButtons from "@/components/Navbar/RightContent/AuthButtons";
import NewPostForm from "@/components/forum/NewPostForm";
// import { auth } from "@/firebase/clientApp";
// import useForumData from "@/hooks/useForumData";
import { Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

// Post submission page where the user can create a new post.
const SubmitPostPage = () => {
//   const [user] = useAuthState(auth);
  // Access Forum data using custom hook
//   const { ForumStateValue } = useForumData();
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <PageContent>
      <>
        <Box p="14px 0px">
          <Text fontSize="20pt" fontWeight={700} color="black">
            Create Post
          </Text>
        </Box>
        {user ? (
          <NewPostForm
            user={user}
            ForumImageURL={ForumStateValue.currentForum?.image_url}
            currentForum={ForumStateValue.currentForum}
          />
        ) : (
          <Stack
            justifyContent="center"
            align="center"
            bg="white"
            p={5}
            borderRadius={10}
          >
            <Text fontWeight={600}>Log in or sign up to post</Text>
            <Stack direction="row" spacing={2} ml={4}>
              <AuthButtons />
            </Stack>
          </Stack>
        )}
      </>
      <>
        {ForumStateValue.currentForum && (
          <About ForumData={ForumStateValue.currentForum} />
        )}
      </>
    </PageContent>
  );
};

export default SubmitPostPage;
