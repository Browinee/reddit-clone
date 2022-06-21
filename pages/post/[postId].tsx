import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_POST_BY_ID } from "../../graphql/queries";
import Post from "../../components/Post";
import Loading from "../../components/Loading";
function PostPage() {
  const {
    query: { postId },
  } = useRouter();

  const { data, loading } = useQuery(GET_POST_BY_ID, { variables: { postId } });
  const post: Post = data?.getPost;
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <Post post={post} />
    </div>
  );
}

export default PostPage;
