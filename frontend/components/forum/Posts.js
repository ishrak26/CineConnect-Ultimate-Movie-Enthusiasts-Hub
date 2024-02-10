// import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";
import useCustomToast from "../../hooks/useCustomToast";

const Posts = ({ ForumData, user }) => {
  // const [user] = useAuthState(auth);

  const [loading, setLoading] = useState(false);
  // const {
  //   postStateValue,
  //   setPostStateValue,
  //   onVote,
  //   onDeletePost,
  //   onSelectPost,
  // } = usePosts();
  const showToast = useCustomToast();

  const postStateValue = {
    posts: ForumData,
    postVotes: [],
  };

  const onVote = () => {};
  const onDeletePost = () => {};
  const onSelectPost = () => {};
  const { setPostStateValue } = [];

  // const getPosts = async () => {
  //   try {
  //     setLoading(true);
  //     const postsQuery = query(
  //       collection(firestore, "posts"),
  //       where("ForumId", "==", ForumData.id),
  //       orderBy("createTime", "desc")
  //     );
  //     const postDocs = await getDocs(postsQuery);
  //     const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     setPostStateValue((prev) => ({
  //       ...prev,
  //       posts: posts,
  //     }));
  //   } catch (error) {
  //     console.log("Error: getPosts", error.message);
  //     showToast({
  //       title: "Posts not Loaded",
  //       description: "There was an error loading posts",
  //       status: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getVotes = async () => {
  };

  // useEffect(() => {
  //   getPosts();
  // }, [ForumData]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack spacing={3}>
          {postStateValue.posts.map((item) => (
            <PostItem
              key={item.postId}
              post={item}
              userIsCreator={user === item.author.id}
              // userVoteValue={
              //   postStateValue.postVotes.find((vote) => vote.postId === item.id)
              //     ?.voteValue
              // }
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
