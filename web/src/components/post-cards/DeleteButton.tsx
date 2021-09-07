import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";
import { useDeletePostMutation } from "../../generated/graphql";

interface DeleteButtonProps {
  postId: number;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ postId }) => {
  const [, deletePost] = useDeletePostMutation();
  return (
    <IconButton
      ml="auto"
      variant="ghost"
      colorScheme="red"
      aria-label="Delete Post"
      icon={<DeleteIcon />}
      onClick={() => {
        deletePost({ id: postId });
      }}
    />
  );
};
