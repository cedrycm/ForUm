// import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import React from "react";
import { NextChakraLink } from "../components/NextChakraLink";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      <NextChakraLink href="/create-post" as={`/create-post`}>
        create post
      </NextChakraLink>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
