import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

const ImageUpload = ({
  selectedFile,
  onSelectImage,
  setSelectedTab,
  setSelectedFile,
}) => {
  // Button -> selectedFileRef -> input
  const selectedFileRef = useRef(null);

  return (
    <Flex justify="center" direction="column" align="center" width="100%">
      {selectedFile ? (
        // If the image is uploaded
        <>
          <Image
            src={selectedFile}
            alt="Uploaded image for post"
            maxWidth="90%"
            maxHeight="400px"
            borderRadius={10}
            shadow="md"
          />
          <Stack direction="row" mt={4}>
            <Button onClick={() => setSelectedTab("Post")} w="100%" shadow="md">
              Back to Post
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedFile("")} // clearing image state removes uploaded image
              w="100%"
              shadow="md"
            >
              Remove Content
            </Button>
          </Stack>
        </>
      ) : (
        // If the image is not uploaded
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="red.200"
          width="100%"
          borderRadius={10}
        >
          {/* Upload button */}
          <Button
            shadow="md"
            onClick={() => {
              selectedFileRef.current?.click();
            }}
          >
            Upload Content
          </Button>
          {/* Hidden input */}
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            ref={selectedFileRef}
            hidden
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
