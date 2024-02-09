import { Flex, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import React from "react";

const CommunityLoader = () => (
  <Flex
    bg="white"
    justify="space-between"
    align="center"
    p={5}
    borderRadius={10}
    shadow="md"
  >
    <SkeletonCircle size="14" />
    <Skeleton height="10px" width="80%" />
  </Flex>
);

export default CommunityLoader;
