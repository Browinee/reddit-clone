import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from "../graphql/queries";
import Post from "./Post";

function Feed({ topic }: { topic?: string }) {
  const { data, error } = !topic
    ? useQuery(GET_ALL_POSTS)
    : useQuery(GET_ALL_POSTS_BY_TOPIC, { variables: { topic } });
  const posts: Post[] =
    (topic ? data?.getPostListByTopic : data?.getPostList) || [];

  return (
    <div className="mt-5 space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
