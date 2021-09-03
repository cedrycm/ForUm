import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface VoteSectionProps {
  post: PostSnippetFragment;
}

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  //local state to show loading for voting conditions
  const [loadingState, setLoadingState] = useState<
    "vouch-loading" | "no-vouch-loading" | "not-loading"
  >();
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        onClick={() => {
          setLoadingState("vouch-loading");
          vote({
            votePostId: post.id,
            voteValue: 1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "vouch-loading"}
        aria-label="vote up"
        icon={<ChevronUpIcon boxSize="24px" />}
      />
      {post.points}
      <IconButton
        onClick={() => {
          setLoadingState("no-vouch-loading");
          vote({
            votePostId: post.id,
            voteValue: -1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "no-vouch-loading"}
        aria-label="vote down"
        icon={<ChevronDownIcon boxSize="24px" />}
      />
    </Flex>
  );
};
