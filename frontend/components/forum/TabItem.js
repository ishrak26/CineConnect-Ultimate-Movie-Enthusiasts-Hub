import React from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';

const TabItem = ({ item, selected, setSelectedTab }) => {
  return (
    <Flex
      justify="center"
      align="center"
      fontWeight="800"
      fontSize="16pt"
      flexGrow={1}
      width="0" // This ensures the icons are split evenly
      p="14px 0px"
      cursor="pointer"
      _hover={{ bg: "gray.50", boxShadow: "lg" }}
      color={selected ? "red.500" : "gray.500"}
      borderWidth="1px"
      borderColor={selected ? "red.500" : "gray.200"}
      borderRadius="10px"
      onClick={() => setSelectedTab(item.title)}
      shadow="md"
    >
      <Flex align="center" height="20px" mr="2">
        <Icon as={item.icon} />
      </Flex>
      <Text fontSize="10pt">{item.title}</Text>
    </Flex>
  );
};

export default TabItem;
