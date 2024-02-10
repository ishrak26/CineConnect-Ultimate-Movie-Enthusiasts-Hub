import { auth, firestore } from "@/firebase/clientApp";
import useCustomToast from "@/hooks/useCustomToast";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { Checkbox, Flex, Icon, Input, Text, Box } from '@chakra-ui/react';
import { BsFillPersonFill, BsFillEyeFill, HiLockClosed } from 'react-icons/bs';

const COMMUNITY_TYPE_OPTIONS = [
  {
    name: "public",
    icon: BsFillPersonFill,
    label: "Public",
    description: "Everyone can view and post",
  },
  {
    name: "restricted",
    icon: BsFillEyeFill,
    label: "Restricted",
    description: "Everyone can view but only subscribers can post",
  },
  {
    name: "private",
    icon: HiLockClosed,
    label: "Private",
    description: "Only subscribers can view and post",
  },
];

const CreateCommunityModal = ({ open, handleClose }) => {
  const [user] = useAuthState(auth);
  const communityNameLengthLimit = 25;
  const [communityName, setCommunityName] = useState("");
  const [charRemaining, setCharRemaining] = useState(communityNameLengthLimit);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const showToast = useCustomToast();

  const handleChange = (event) => {
    if (event.target.value.length > communityNameLengthLimit) return;
    setCommunityName(event.target.value);
    setCharRemaining(communityNameLengthLimit - event.target.value.length);
  };

  const onCommunityTypeChange = (event) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError("");
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName)) {
      setError("Community name can only contain letters and numbers");
      return;
    }
    if (communityName.length < 3) {
      setError("Community name must be at least 3 characters long");
      return;
    }

    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);
      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`The community ${communityName} is already taken. Try a different name!`);
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
          communityId: communityName,
          isAdmin: true,
        });
      });

      router.push(`/community/${communityName}`);
      handleClose();
    } catch (error) {
      console.error("Error: handleCreateCommunity", error);
      setError(error.message);
      showToast({
        title: "Community not Created",
        description: "There was an error creating your community",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Community</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CommunityNameSection
            communityName={communityName}
            handleChange={handleChange}
            charRemaining={charRemaining}
            error={error}
          />
          <Text mt={4}>Community Type</Text>
          {COMMUNITY_TYPE_OPTIONS.map((option) => (
            <Checkbox
              key={option.name}
              name={option.name}
              isChecked={communityType === option.name}
              onChange={onCommunityTypeChange}
            >
              <Flex align="center">
                <Icon as={option.icon} mr={2} />
                <Text mr={1}>{option.label}</Text>
                <Text color="gray.500">{option.description}</Text>
              </Flex>
            </Checkbox>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button variant="ghost" onClick={handleCreateCommunity} isLoading={loading}>Create Community</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCommunityModal;


const CommunityTypeOption = ({ name, icon, label, description, isChecked, onChange }) => {
  return (
    <Checkbox name={name} isChecked={isChecked} onChange={onChange} colorScheme="red">
      <Flex align="center">
        <Icon as={icon} color="gray.500" mr={2} />
        <Text fontSize="10pt" mr={1}>
          {label}
        </Text>
        <Text fontSize="8pt" color="gray.500" pt={1}>
          {description}
        </Text>
      </Flex>
    </Checkbox>
  );
};

const CommunityTypeOptions = ({ options, communityType, onCommunityTypeChange }) => {
  return (
    <div>
      {options.map((option) => (
        <CommunityTypeOption
          key={option.name}
          name={option.name}
          icon={option.icon}
          label={option.label}
          description={option.description}
          isChecked={communityType === option.name}
          onChange={onCommunityTypeChange}
        />
      ))}
    </div>
  );
};

const CommunityNameSection = ({ communityName, handleChange, charRemaining, error }) => {
  return (
    <Box>
      <Text fontWeight={600} fontSize="15">
        Name
      </Text>
      <Text fontSize="11" color="gray.500">
        Community names cannot be changed
      </Text>
      <Input
        mt={2}
        value={communityName}
        placeholder="Community Name"
        onChange={handleChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "red.500" }}
        _focus={{ outline: "none", border: "1px solid", borderColor: "red.500" }}
      />
      <Text fontSize="9pt" mt={1} color={charRemaining === 0 ? "red" : "gray.500"}>
        {charRemaining} Characters remaining
      </Text>
      <Text fontSize="9pt" color="red" pt={1}>
        {error}
      </Text>
    </Box>
  );
};
