import React from "react";
import { Button, Flex, Icon, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoPeopleCircleOutline } from "react-icons/io5";

const CommunityItem = ({ community, isJoined, onJoinOrLeaveCommunity }) => {
  const router = useRouter();

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
        borderColor: "gray.400",
        boxShadow: "xl",
      }}
      cursor="pointer"
      onClick={() => {
        router.push(`/community/${community.id}`);
      }}
      shadow="md"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        flexGrow={1}
        align="left"
      >
        <CommunityItemNameIconSection community={community} />
        <CommunityItemButtonMembersSection
          community={community}
          onJoinOrLeaveCommunity={onJoinOrLeaveCommunity}
          isJoined={isJoined}
        />
      </Stack>
    </Flex>
  );
};

export default CommunityItem;

const CommunityItemNameIconSection = ({ community }) => {
  return (
    <Flex align="center" width="100%">
      <Flex align="center" direction="row">
        {community.imageURL ? (
          <Image
            src={community.imageURL}
            borderRadius="full"
            boxSize="35px"
            mr={4}
            alt="Community Icon"
          />
        ) : (
          <Icon
            as={IoPeopleCircleOutline}
            fontSize={38}
            color="red.500"
            mr={4}
          />
        )}
        <Text fontSize={16}>{community.id}</Text>
      </Flex>
    </Flex>
  );
};

const CommunityItemButtonMembersSection = ({
  community,
  onJoinOrLeaveCommunity,
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
        {community.numberOfMembers}
      </Flex>
      <Button
        height="30px"
        width="130px"
        fontSize="10pt"
        variant={isJoined ? "outline" : "solid"}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation(); // stop the event from bubbling up
          onJoinOrLeaveCommunity(community, isJoined);
        }}
      >
        {isJoined ? "Unsubscribe" : "Subscribe"}
      </Button>
    </Stack>
  );
};
