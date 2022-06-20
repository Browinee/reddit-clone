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

interface PostProps {
  post: Post;
}
function Post({ post }: PostProps) {
  return (
    <div className="flex cursor-pointer border border-gray-300  bg-white shadow-sm  hover:border hover:border-gray-400">
      <div className="p-4 flex flex-col items-center  justify-start space-y-1 rounded-l-md bg-gray-50 text-gray-400">
        <ArrowUpIcon className="vote-button hover:text-red-400" />
        <p className="text-black font-bold text-xs">0</p>
        <ArrowDownIcon className="hover:text-blue-400" />
      </div>
      <div className="p-3 pb-1">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Avatar name={post.username} seed={post.subreddit[0].topic} />
          <p className="text-xs text-gray-400">
            <span className="font-bold text-black hover:text-gray-700 hover:underline">
              r/{post.subreddit[0].topic}
            </span>
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
            <p className="hidden sm:inline">{post.commentList.length} Award</p>
          </div>
          <div className="post-button">
            <ShareIcon className="h-6 w-6" />
            <p className="hidden sm:inline">{post.commentList.length} Share</p>
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
  );
}

export default Post;
