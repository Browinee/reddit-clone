import { LinkIcon, PhotographIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React from "react";
import Avatar from "./Avatar";
function PostBox() {
  const { data: session } = useSession();
  return (
    <form className="sticky top-16 z-50 p-2 border rounded-md border-gray-300 bg-white">
      <div className="flex items-center space-x-3">
        <Avatar large name={session?.user?.name || ""} />

        <input
          className="outline-none p-2 pl-5 flex-1 rounded-md bg-gray-50"
          type="text"
          disabled={!session}
          placeholder={
            session ? "Create a post by entering a title" : "Sign in to post"
          }
        />
        <PhotographIcon className={`h-6 text-gray-300 cursor-pointer`} />
        <LinkIcon className={`h-6 text-gray-300`} />
      </div>
    </form>
  );
}

export default PostBox;
