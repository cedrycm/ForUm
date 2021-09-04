// import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import React, { useState } from "react";
import { NextChakraLink } from "../components/NextChakraLink";
import { Flex, Heading, Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { PostCard } from "../components/PostCard";


const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null as null | string,
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
          {data!.posts.posts.map((p) => (
            //Abstracted out to ../components/PostCard
            <PostCard post={p} key={p.id}></PostCard>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

// export async function getStaticProps(ctx: any) {
//   const ssrCache = ssrExchange({ isClient: false });
//   const client = getUrqlClientSS(ssrExchange({ isClient: false }), ctx);

//   // This query is used to populate the cache for the query
//   // used on this page.
//   await client!.query(INDEX_QUERY).toPromise();

//   return {
//     props: {
//       // urqlState is a keyword here so withUrqlClient can pick it up.
//       urqlState: ssrCache.extractData(),
//     },
//     revalidate: 600,
//   };
// }

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
