import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({ title, description, status }) => {
    toast({
      title,
      description,
      status,
      duration: 5000, // Hardcoded duration
      isClosable: true, // Allows the toast to be closed manually
    });
  };

  return showToast;
};

export default useCustomToast;
