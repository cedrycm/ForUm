import {
  Flex,
  useColorModeValue,
  Box,
  chakra,
  Link,
  ButtonGroup,
} from "@chakra-ui/react";
import { AiOutlineTwitter, AiOutlineLink } from "react-icons/ai";
import React, { useState } from "react";
import { PostsSnippetFragment } from "../../generated/graphql";
import { toFormalDate } from "../../utils/toFormalDate";
import { VoteSection } from "./VoteSection";
import { NextChakraLink } from "../NextChakraLink";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";

type PostCardType = PostsSnippetFragment;
interface PrimaryPostCardProps {
  post: PostCardType;
}
export const PrimaryPostCard: React.FC<PrimaryPostCardProps> = ({ post }) => {
  const [isVisible, setVisibility] = useState<"is-visible" | "not-visible">();
  const isOriginalPoster = post.creator.email ? true : false;
  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.600")}
      p={15}
      w="full"
      alignItems="center"
      justifyContent="center"
      rounded="md"
      onMouseEnter={() => {
        setVisibility("is-visible");
      }}
      onMouseLeave={() => {
        setVisibility("not-visible");
      }}
    >
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
        <Flex justifyContent="flex-start" alignItems="center">
          <VoteSection post={post} />

          <Box>
            <Flex alignItems="center">
              <chakra.h1
                fontSize="x-large"
                fontWeight="bold"
                mt={2}
                color={useColorModeValue("gray.800", "white")}
              >
                {post?.title}
              </chakra.h1>
              {isOriginalPoster && isVisible === "is-visible" ? (
                <ButtonGroup ml="auto">
                  <EditButton postId={post.id} />
                  <DeleteButton postId={post.id} />{" "}
                </ButtonGroup>
              ) : null}
            </Flex>
            <Flex alignItems="center">
              <chakra.span
                fontSize="sm"
                color={useColorModeValue("gray.800", "gray.400")}
              >
                <NextChakraLink href="">{post.creator.username}</NextChakraLink>{" "}
                {":"}
              </chakra.span>
              <chakra.span
                ml={2}
                fontSize="sm"
                color={useColorModeValue("gray.800", "gray.400")}
              >
                {toFormalDate(post?.createdAt!)}
              </chakra.span>
            </Flex>
            <chakra.p
              fontSize="medium"
              mt={2}
              color={useColorModeValue("gray.600", "gray.300")}
            >
              {post?.text}
            </chakra.p>
          </Box>
        </Flex>

        <Box>
          <Flex alignItems="center" justifyContent="center" mt={4}>
            <Link
              mr={2}
              color={useColorModeValue("gray.800", "gray.400")}
              _hover={{ color: useColorModeValue("gray.700", "gray.300") }}
              cursor="pointer"
            >
              <AiOutlineTwitter />
            </Link>

            <Link
              mr={2}
              color={useColorModeValue("gray.800", "gray.400")}
              _hover={{ color: useColorModeValue("gray.700", "gray.300") }}
              cursor="pointer"
            >
              <AiOutlineLink />
            </Link>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};
