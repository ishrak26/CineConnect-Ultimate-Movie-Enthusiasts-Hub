import React, { useEffect, useState } from "react";
import { Flex, Icon, Link, Skeleton, SkeletonCircle, Stack, Image, Text, Box, Button } from "@chakra-ui/react";
// import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { IoPeopleCircleOutline } from "react-icons/io5";
// import { firestore } from "./firebase/clientApp"; 
// import useForumData from "./useForumData"; 
import useCustomToast from "../../hooks/useCustomToast";

const Recommendations = () => {
  return (
    <Flex
      direction="column"
      position="relative"
      bg="white"
      borderRadius={10}
      border="1px solid"
      borderColor="gray.300"
      shadow="md"
    >
      <SuggestionsHeader />
      <Flex direction="column" mb={2}>
        <SuggestedForumsList />
      </Flex>
    </Flex>
  );
};

const SuggestionsHeader = () => {
  return (
    <Flex
      align="flex-end"
      color="white"
      p="6px 10px"
      height="70px"
      borderRadius="10px 10px 0px 0px"
      fontWeight={700}
      bgImage="url('/large.png')"
      backgroundSize="cover"
      bgGradient="linear(to bottom, rgba(139, 0, 0, 0), rgba(139, 0, 0, 0.75)), url('/large.png')"
    >
      Top Forums
    </Flex>
  );
};

const SuggestedForumsList = () => {
//   const { ForumStateValue, onJoinOrLeaveForum } = useForumData();
    const { ForumStateValue, onJoinOrLeaveForum } = [];
  const [loading, setLoading] = useState(false);
  const [Forums, setForums] = useState([]);
  const router = useRouter();
  const showToast = useCustomToast();

  const getForumRecommendations = async () => {
    setLoading(true);
    try {
    //   const ForumQuery = query(collection(firestore, "Forums"), orderBy("numberOfMembers", "desc"), limit(5));
    //   const ForumDocs = await getDocs(ForumQuery);
    //   const Forums = ForumDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //   setForums(Forums);
    } catch (error) {
      console.log("Error: getForumRecommendations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getForumRecommendations();
  }, []);

  return (
    <Flex direction="column" mb={0}>
      {loading ? (
        <Stack mt={2} p={3}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Flex justify="space-between" align="center" key={index}>
                <SkeletonCircle size="10" />
                <Skeleton height="10px" width="70%" />
              </Flex>
            ))}
        </Stack>
      ) : (
        <>
          {Forums.map((item, index) => {
            const isJoined = !!ForumStateValue.mySnippets.find(
              (snippet) => snippet.ForumId === item.id
            );
            return (
              <Link key={item.id} href={`/Forum/${item.id}`}>
                <Flex
                  key={item.id}
                  align="center"
                  fontSize="10pt"
                  borderBottom="1px solid"
                  borderColor="gray.300"
                  p="10px 12px"
                >
                  <Flex width="80%" align="center">
                    <Flex width="15%">
                      <Text>{index + 1}</Text>
                    </Flex>
                    <Flex align="center" width="80%">
                      {item.imageURL ? (
                        <Image
                          src={item.imageURL}
                          borderRadius="full"
                          boxSize="28px"
                          mr={2}
                          alt="Forum Icon"
                        />
                      ) : (
                        <Icon
                          as={IoPeopleCircleOutline}
                          fontSize={34}
                          color="black"
                          mr={1}
                        />
                      )}
                      {/* show dots when Forum name doesnt fit */}
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {`${item.id}`}
                      </span>
                    </Flex>
                  </Flex>
                  <Box position="absolute" right="10px">
                    <Button
                      height="24px"
                      width="100px"
                      fontSize="8pt"
                      variant={isJoined ? "outline" : "solid"}
                      onClick={(event) => {
                        event.preventDefault();
                        onJoinOrLeaveForum(item, isJoined);
                      }}
                    >
                      {isJoined ? "Unsubscribe" : "Subscribe"}
                    </Button>
                  </Box>
                </Flex>
              </Link>
            );
          })}
        </>
      )}
      <Box p="10px 20px">
        <Button
          height="30px"
          width="100%"
          onClick={() => {
            router.push(`/Forums`);
          }}
        >
          View All
        </Button>
      </Box>
    </Flex>
  );
};

export default Recommendations;
