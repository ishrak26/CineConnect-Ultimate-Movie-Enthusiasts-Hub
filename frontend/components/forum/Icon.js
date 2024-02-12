import { Flex, Icon } from "@chakra-ui/react";
import React from "react";

const IconItem = ({
  icon,
  fontSize,
  onClick,
  iconColor = "black",
}) => {
  return (
    <Flex
      mr={1.5}
      ml={1.5}
      padding={1}
      cursor="pointer"
      borderRadius={4}
      _hover={{
        bg: "gray.200",
      }}
      onClick={onClick}
    >
      <Icon as={icon} fontSize={fontSize} color={iconColor} />
    </Flex>
  );
};

export default IconItem;
