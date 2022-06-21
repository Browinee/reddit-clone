import { LinkIcon, PhotographIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import React, { useCallback, useState } from "react";
import Avatar from "./Avatar";
import { useForm, SubmitHandler } from "react-hook-form";
import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GET_ALL_POSTS, GET_SUBREDDIT_LIST_BY_TOPIC } from "../graphql/queries";
import toast from "react-hot-toast";
interface PostFormProps {
  title: string;
  body: string;
  image: string;
  subreddit: string;
}

function PostBox({ subreddit }: { subreddit?: string }) {
  const { data: session } = useSession();
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_ALL_POSTS }, "getPostList"],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [getSubredditListByTopicQuery] = useLazyQuery(
    GET_SUBREDDIT_LIST_BY_TOPIC
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const resetForm = useCallback(() => {
    setValue("body", "");
    setValue("image", "");
    setValue("title", "");
    setValue("subreddit", "");
  }, [setValue]);

  const onSubmit: SubmitHandler<PostFormProps> = async (formData) => {
    const notification = toast.loading("Creating post...");

    try {
      const {
        data: { getSubredditListByTopic },
      } = await getSubredditListByTopicQuery({
        variables: { topic: subreddit || formData.subreddit },
      });
      console.log("getSubredditListByTopic", getSubredditListByTopic);

      // NOTE: check if subreddit exist
      if (!getSubredditListByTopic.length) {
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });
        console.log("newSubreddit", newSubreddit);

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.body,
            image: formData.image || "",
            subreddit_id: subreddit || newSubreddit.id,
            title: formData.title,
            username: session?.user?.name,
          },
        });
        console.log("newPost", newPost);
      } else {
        // NOTE: use existing subreddit
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.body,
            image: formData.image || "",
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.title,
            username: session?.user?.name,
          },
        });
        console.log("newPost with existing id", newPost);
      }
      // NOTE: after the post was added.
      resetForm();
      toast.success("New Post Created!", { id: notification });
    } catch (e) {
      console.log("e", e);

      toast.error("Whoops something went wrong when creating post.", {
        id: notification,
      });
    }
  };
  const [isImageBoxOpen, setIsImageBoxOpen] = useState(false);

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
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : "Create a post by entering a title"
              : "Sign in to post"
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
          {!subreddit && (
            <div className="flex items-center px-2 ">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                className="outline-none flex-1 p-2 m-2 bg-blue-50 "
                type="text"
                placeholder="i.e.reactjs"
                {...register("subreddit", { required: true })}
              />
            </div>
          )}
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
