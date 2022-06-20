import { gql } from "@apollo/client";

export const GET_SUBREDDIT_LIST_BY_TOPIC = gql`
  query getSubredditListByTopic($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
