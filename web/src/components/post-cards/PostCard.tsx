import { useRouter } from "next/router";
import { PostsSnippetFragment } from "../../generated/graphql";
import { PostCardStack } from "./PostCardStack";
import { PrimaryPostCard } from "./PrimaryPostCard";

export type PostCardType = PostsSnippetFragment;

interface PostCardProps {
  post: PostCardType;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  const isIndex = router.pathname === "/";

  if (isIndex) {
    return <PostCardStack post={post} />;
  } else {
    return <PrimaryPostCard post={post} />;
  }
};
