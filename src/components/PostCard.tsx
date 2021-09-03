import { Box, Heading, Text } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import { PostsQuery } from "../generated/graphql";
import { VoteSection } from "./VoteSection";

type PostCardType = PostsQuery["posts"]["posts"][0];

interface PostCardProps {
  post: PostCardType;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <Box key={post.id} p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{post.title}</Heading>
      <Text>posted by {post.creator.username}</Text>
      <Text mt={4}>{post.textSnippet}</Text>
    </Box>
=======
=======
>>>>>>> 075397f480323d1e51de0d0d67e3b8f69f4d371c
    <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
      <VoteSection post={post} />
      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        {post.creator.username}
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>
    </Flex>
<<<<<<< HEAD
>>>>>>> implement voting ui and mutation
=======
>>>>>>> 075397f480323d1e51de0d0d67e3b8f69f4d371c
  );
};
