import { Button } from "@chakra-ui/button";
import { EditIcon } from "@chakra-ui/icons";
import { Box, Flex, Link } from "@chakra-ui/layout";
import { Heading, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { DarkModeButton } from "./DarkModeSwitch";
import { NextChakraLink } from "./NextChakraLink";
// import { isServer } from "../utils/isServer";

interface NavBarProps {}
export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({});
  let body = null;

  //data is loading
  if (fetching) {
    body = null;
    //user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <Box mr={2}>
          <DarkModeButton />
        </Box>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">register</Link>
        </NextLink>
      </>
    );
    //user is logged in
  } else {
    // console.log(data);
    body = (
      <Flex alignItems="center">
        <NextChakraLink
          alignItems="center"
          mr={2}
          href="/create-post"
          as={`/create-post`}
        >
          <IconButton
            variant="ghost"
            aria-label="vote up"
            icon={<EditIcon />}
          />
        </NextChakraLink>
        <Box mr={2}>
          <DarkModeButton />
        </Box>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          colorScheme="whiteAlpha"
          color="white"
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      z={1}
      alignItems="center"
      position="sticky"
      top={0}
      bg="seagreen"
      p={4}
    >
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextChakraLink href="/" as={`/`}>
          <Heading colorScheme="whiteAlpha">ForUm</Heading>
        </NextChakraLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
