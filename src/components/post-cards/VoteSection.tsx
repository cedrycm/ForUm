import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  PostsSnippetFragment,
  useVoteMutation,
} from "../../generated/graphql";

type VotePostType = PostSnippetFragment | PostsSnippetFragment;

interface VoteSectionProps {
  post: VotePostType;
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
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("vouch-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "vouch-loading"}
        aria-label="vote up"
        icon={<ChevronUpIcon boxSize="24px" />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("no-vouch-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "no-vouch-loading"}
        aria-label="vote down"
        icon={<ChevronDownIcon boxSize="24px" />}
      />
    </Flex>
  );
};
