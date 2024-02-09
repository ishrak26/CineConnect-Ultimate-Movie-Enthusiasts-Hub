import { Flex } from "@chakra-ui/react";
import React from "react";

/**
 * Creates a layout for the main content page.
 * The page is separated into 2 sections (array of 2):
 *  - Left: main content such as the list of posts
 *  - Right: extra content such as community descriptions, etc
 *
 * The layout is responsive which means that in mobile screen sizes,
 * the right layout will be removed.
 * @param {children} children - children components in every page
 * @returns page layout
 */
const PageContent = ({ children }) => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" justify="center" maxWidth="1200px">
        {/* Left */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {/* check if the children exist before rendering */}
          {children && children[0]}
        </Flex>

        {/* Right */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {children && children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PageContent;
