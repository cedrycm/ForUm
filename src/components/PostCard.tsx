import { Box, Heading, Text } from "@chakra-ui/layout";
import { PostsQuery } from "../generated/graphql";

type PostCardType = PostsQuery["posts"]["posts"][0];

interface PostCardProps {
  post: PostCardType;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Box key={post.id} p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{post.title}</Heading>
      <Text mt={4}>{post.textSnippet}</Text>
    </Box>
  );
};
