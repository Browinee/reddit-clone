import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Feed from "../components/Feed";
import PostBox from "../components/PostBox";
import { GET_SUBREDDIT_LIST_WITH_LIMIT } from "../graphql/queries";
import SubredditRow from "../components/SubredditRow";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const { data } = useQuery(GET_SUBREDDIT_LIST_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  });
  console.log("data", data);

  const subreddits: Subreddit[] = data?.getSubredditListLimit;

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>Reddit Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostBox />
      <div className="flex">
        <Feed />
        <div className="sticky top-44 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>

          <div>
            {subreddits?.map((subreddit, i) => (
              <SubredditRow
                key={subreddit.id}
                index={i}
                topic={subreddit.topic}
                name={session?.user?.name || ""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
