import { EditIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";
import { NextChakraLink } from "../NextChakraLink";

interface EditButtonProps {
  postId: number;
}

export const EditButton: React.FC<EditButtonProps> = ({ postId }) => {
  //const [, updatePost] = useUpdatePostMutation();
  return (
    <NextChakraLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
      <IconButton
        ml="auto"
        variant="ghost"
        colorScheme="green"
        aria-label="Delete Post"
        icon={<EditIcon />}
      />
    </NextChakraLink>
  );
};
