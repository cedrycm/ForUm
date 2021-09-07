import {
  Text,
  Flex,
  Box,
  Heading,
  ButtonGroup,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { NextChakraLink } from "../NextChakraLink";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { PostCardType } from "./PostCard";
import { VoteSection } from "./VoteSection";

interface PostCardStackProps {
  post: PostCardType;
}

export const PostCardStack: React.FC<PostCardStackProps> = ({ post }) => {
  const [isVisible, setVisibility] = useState<"is-visible" | "not-visible">();
  const isOriginalPoster = post.creator.email ? true : false;

  return (
    <Box
      w="full"
      maxW=""
      mx="auto"
      px={2}
      py={2}
      bg={useColorModeValue("white", "gray.800")}
      shadow="md"
      rounded="md"
    >
      <Flex
        key={post.id}
        p={5}
        shadow="md"
        borderWidth="1px"
        onMouseEnter={() => {
          setVisibility("is-visible");
        }}
        onMouseLeave={() => {
          setVisibility("not-visible");
        }}
      >
        <VoteSection post={post} />
        <Box>
          <NextChakraLink href="/post/[id]" as={`/post/${post.id}`}>
            <Heading fontSize="xl">{post.title}</Heading>
          </NextChakraLink>
          <Flex>
            <Text>{"posted by: "}</Text>
            <NextChakraLink ml="2" href="">
              {post.creator.username}
            </NextChakraLink>
          </Flex>
          <Text mt={4}>{post.textSnippet}</Text>
        </Box>
        {isOriginalPoster && isVisible === "is-visible" ? (
          <ButtonGroup ml="auto">
            <EditButton postId={post.id} />
            <DeleteButton postId={post.id} />{" "}
          </ButtonGroup>
        ) : null}
      </Flex>
    </Box>
  );
};
