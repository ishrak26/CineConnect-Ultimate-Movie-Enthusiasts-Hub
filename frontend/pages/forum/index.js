import CreatePostLink from "@components/forum/CreatePostLink";
import PersonalHome from "@components/forum/PersonalHome";
import Recommendations from "@components/forum/Recommendations";
import PageContent from "@components/forum/PageContent";
import PostLoader from "@components/forum/PostLoader";
import PostItem from "@components/forum/PostItem";
import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@theme/theme";
import Navbar from "@components/navbar";
import BaseLayout from "@components/BaseLayout";
import Head from 'next/head'


export default function Home() {

  const [loading, setLoading] = useState(false);
//   const { communityStateValue } = useCommunity();
  const { communityStateValue } = [];
//   const { setPostStateValue, postStateValue, onSelectPost, onVote, onDeletePost } = usePosts();
//   const showToast = useCustomToast();
// const { setPostStateValue, postStateValue, onSelectPost, onVote, onDeletePost } = [];

let posts = {
  id: 1,
  title: "Post Title",
  body: "Post Body",
  creatorId: 1,
  communityId: 1,
  voteStatus: 1,  
}

const postStateValue = {
// create some mock data for postStateValue
  posts: [posts],
  postVotes: [],
};

const onSelectPost = () => {}

const onVote = () => {}

const onDeletePost = () => {}

  const user = {
    uid: 1,
  }
  

  const buildUserHomeFeed = async () => {
    setLoading(true);

    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        ); // get all community ids that the user is a member of
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          // orderBy("voteStatus", "desc"),
          limit(10)
        ); // get all posts in community with certain requirements
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // get all posts in community

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts,
        })); // set posts in state
      } else {
        buildGenericHomeFeed();
      }
    } catch (error) {
        console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buildGenericHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      ); // get all posts in community with certain requirements

      const postDocs = await getDocs(postQuery); // get all posts in community
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // get all posts in community
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts,
      })); // set posts in state
    } catch (error) {
      console.log("Error: buildGenericHomeFeed", error);
      showToast({
        title: "Could not Build Home Feed",
        description: "There was an error while building your home feed",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserPostVotes = async () => {
    try {
        const postIds = postStateValue.posts.map((post) => post.id); // get all post ids in home feed
        const postVotesQuery = query(
          collection(firestore, `users/${user?.uid}/postVotes`),
          where("postId", "in", postIds)
        ); // get all post votes for posts in home feed
        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // get all post votes for posts in home feed
  
        setPostStateValue((prev) => ({
          ...prev,
          postVotes: postVotes,
        })); // set post votes in state
      } catch (error) {
        console.log("Error: getUserPostVotes", error);
        showToast({
          title: "Could not Get Post Votes",
          description: "There was an error while getting your post votes",
          status: "error",
        });
      }
  };

  // useEffect(() => {
  //   if (communityStateValue.mySnippets) {
  //       buildUserHomeFeed();
  //     }
  // }, [communityStateValue.snippetFetched]);

  // useEffect(() => {
  //   if (!user && !loadingUser) {
  //       buildGenericHomeFeed();
  //     }
  // }, [user, loadingUser]);

  // useEffect(() => {
  //   if (user && postStateValue.posts.length) {
  //       getUserPostVotes();
  
  //       return () => {
  //         setPostStateValue((prev) => ({
  //           ...prev,
  //           postVotes: [],
  //         }));
  //       };
  //     }
  // }, [user, postStateValue.posts]);

  return (
    
    <ChakraProvider theme={theme}>
     <Head>
        <title>Forums &mdash; CineConnect</title>
        <meta
          name="description"
          content="Millions of movies, TV shows and people to discover. Explore now."
        />
        <meta
          name="keywords"
          content="where can i watch, movie, movies, tv, tv shows, cinema, movielister, movie list, list"
        />

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <Navbar />
     <BaseLayout> 
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack spacing={3}>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find((item) => item.postId === post.id)?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                showCommunityImage={true}
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={2}>
        <Recommendations />
        <PersonalHome />
      </Stack>
    </PageContent>
    </BaseLayout>
    </ChakraProvider>
  );
}

export async function getServerSideProps({ query }) {

  let response
  const limit = 9
  const offset = (query.page - 1) * limit || 0

  if (query.with_genres) {
    response = await fetch(
      `http://localhost:4000/v1/genre/${query.with_genres}/movies?limit=${limit}&offset=${offset}`
    ).then((res) => res.json())
  } else {
    response = await fetch(
      `http://localhost:4000/v1/movies?limit=${limit}&offset=${offset}`
    ).then((res) => res.json())
  }

  if (response.status === 404) {
    return {
      notFound: true,
    }
  }

  if (response.success === false) {
    return {
      props: {
        error: {
          statusCode: response.status,
          statusMessage: response.errors[0] || response.status_message,
        },
      },
    }
  }

  // const { data: genresData } = await tmdb.get('/genre/movie/list')
  const genres = await fetch(`http://localhost:4000/v1/genres`).then((res) =>
    res.json()
  )

  const totalMovies = await fetch(`http://localhost:4000/v1/movies/count`).then(
    (res) => res.json()
  )

  return {
    props: {
      data: response,
      genres: genres,
      query,
      totalMovies: totalMovies.count,
    },
  }
}