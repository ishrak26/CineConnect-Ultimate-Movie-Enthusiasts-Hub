// import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

const Posts = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  // const {
  //   postStateValue,
  //   setPostStateValue,
  //   onVote,
  //   onDeletePost,
  //   onSelectPost,
  // } = usePosts();
  // const showToast = useCustomToast();

  const postStateValue = {
    posts: [],
    postVotes: [],
  };

  const onVote = () => {};
  const onDeletePost = () => {};
  const onSelectPost = () => {};
  const { setPostStateValue } = [];

  const getPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createTime", "desc")
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts,
      }));
    } catch (error) {
      console.log("Error: getPosts", error.message);
      showToast({
        title: "Posts not Loaded",
        description: "There was an error loading posts",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getPosts();
  // }, [communityData]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack spacing={3}>
          {postStateValue.posts.map((item) => (
            <PostItem
              key={item.id}
              post={item}
              userIsCreator={user?.uid === item.creatorId}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === item.id)
                  ?.voteValue
              }
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
