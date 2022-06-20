import { LinkIcon, PhotographIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { useForm } from "react-hook-form";
interface PostFormProps {
  title: string;
  body: string;
  image: string;
  subreddit: string;
}

function PostBox() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = () => console.log(123);
  const [isImageBoxOpen, setIsImageBoxOpen] = useState(false);
  console.log("errorws", errors);

  return (
    <form
      className="sticky top-16 z-50 p-2 border rounded-md border-gray-300 bg-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center space-x-3">
        <Avatar large name={session?.user?.name || ""} />

        <input
          {...register("title", { required: true })}
          className="outline-none p-2 pl-5 flex-1 rounded-md bg-gray-50"
          type="text"
          disabled={!session}
          placeholder={
            session ? "Create a post by entering a title" : "Sign in to post"
          }
        />
        <PhotographIcon
          onClick={() => setIsImageBoxOpen(!isImageBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${
            isImageBoxOpen && "text-blue-300"
          }`}
        />
        <LinkIcon className={`h-6 text-gray-300`} />
      </div>
      {!!watch("title") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2 ">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="outline-none flex-1 p-2 m-2 bg-blue-50 "
              type="text"
              placeholder="Content(Optional)"
              {...register("body")}
            />
          </div>
          <div className="flex items-center px-2 ">
            <p className="min-w-[90px]">Subreddit:</p>
            <input
              className="outline-none flex-1 p-2 m-2 bg-blue-50 "
              type="text"
              placeholder="i.e.reactjs"
              {...register("subreddit", { required: true })}
            />
          </div>
          {isImageBoxOpen && (
            <div className="flex items-center px-2 ">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="outline-none flex-1 p-2 m-2 bg-blue-50 "
                type="text"
                placeholder="Optional..."
                {...register("image")}
              />
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 space-y-2 p-2">
              {errors.title?.type === "required" && (
                <p> A Post Titile is required</p>
              )}
              {errors.subreddit?.type === "required" && (
                <p> A Sudbreddit Titile is required</p>
              )}
            </div>
          )}
          {!!watch("title") && (
            <button
              className=" mt-2 p-2 bg-blue-400 rounded-full text-white"
              type="submit"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;
