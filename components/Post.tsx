import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/solid";
import React from "react";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ADD_VOTE } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { GET_POST_BY_ID } from "../graphql/queries";

interface PostProps {
  post: Post;
}
const displayVotes = (voteLists: Vote[]) => {
  return !voteLists.length
    ? 0
    : voteLists.reduce(
        (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
        0
      );
};

function Post({ post }: PostProps) {
  console.log("post", post);
  const { data: session } = useSession();
  const userVoteInfo = post.voteList.find(
    (vote) => vote.username === session?.user?.name
  );
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [
      { query: GET_POST_BY_ID, variables: { postId: post.id } },
      "getPost",
    ],
  });

  // vote
  // unlogin  disabled with gray
  // login show user's status
  // user mgith contain or not contina
  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast("❗ You'll need to sign in to Vote!");
      return;
    }
    // NOTE: new Upvote is the same with the original isUpvote
    if (userVoteInfo && userVoteInfo.upvote === isUpvote) {
      return;
    }
    //NOTE: should differentiate two usecase
    // add new vote or update existing vote
    const {
      data: { insertVote: newVote },
    } = await addVote({
      variables: {
        post_id: post.id,
        username: session.user?.name,
        upvote: isUpvote,
      },
    });
  };
  return (
    <Link href={`/post/${post.id}`}>
      <div className="flex cursor-pointer border border-gray-300  bg-white shadow-sm  hover:border hover:border-gray-400">
        <div className="p-4 flex flex-col items-center  justify-start space-y-1 rounded-l-md bg-gray-50 text-gray-400">
          <ArrowUpIcon
            onClick={() => upVote(true)}
            className={`vote-button hover:text-red-400 ${
              session && userVoteInfo?.upvote && "text-red-400"
            }`}
          />
          <p className="text-black font-bold text-xs">
            {displayVotes(post.voteList)}
          </p>
          <ArrowDownIcon
            onClick={() => upVote(false)}
            className={`vote-button hover:text-blue-400 ${
              session && userVoteInfo && !userVoteInfo.upvote && "text-blue-400"
            }`}
          />
        </div>
        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar name={post.username} seed={post.subreddit[0].topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post.subreddit[0].topic}`}>
                <span className="font-bold text-black hover:text-gray-700 hover:underline">
                  r/{post.subreddit[0].topic}
                </span>
              </Link>
              • Posted by u/
              {post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>
          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>

          {/* Image */}
          {/* NOTE: we don't know what user will use. If we use <Image /> from  */}
          {/* Nextjs, it might be broken because of domain issue */}
          <img src={post.image} alt="" className="w-full" />

          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="post-button">
              <ChatAltIcon className="h-6 w-6" />
              <p className="">{post.commentList.length} Comments</p>
            </div>
            <div className="post-button">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">
                {post.commentList.length} Award
              </p>
            </div>
            <div className="post-button">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">
                {post.commentList.length} Share
              </p>
            </div>
            <div className="post-button">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">{post.commentList.length} Save</p>
            </div>
            <div className="post-button">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Post;
