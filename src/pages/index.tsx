// import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import React from "react";
import { NextChakraLink } from "../components/NextChakraLink";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      postsLimit: 10,
      postsCursor: null,
    },
  });

  if (!fetching && !data) {
    return <div>No Posts Were Found!</div>;
  }
  return (
    <Layout>
      <Flex align="content-center">
        <Heading>ForUm</Heading>
        <NextChakraLink ml="auto" href="/create-post" as={`/create-post`}>
          create post
        </NextChakraLink>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data ? (
        <Flex>
          <Button isLoading={fetching} m="auto" my={8}>
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
