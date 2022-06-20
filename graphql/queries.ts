import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query getAllPosts {
    getPostList {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      commentList {
        id
        created_at
        post_id
        text
        username
      }
      subreddit {
        id
        topic
        created_at
      }
      voteList {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_SUBREDDIT_LIST_BY_TOPIC = gql`
  query getSubredditListByTopic($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
