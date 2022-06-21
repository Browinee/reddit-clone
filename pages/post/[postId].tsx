import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POST_BY_ID } from "../../graphql/queries";
import Post from "../../components/Post";
import Loading from "../../components/Loading";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ADD_COMMENT } from "../../graphql/mutations";
import Comment from "../../components/Comment";
interface FormData {
  comment: string;
}

function PostPage() {
  const {
    query: { postId },
  } = useRouter();
  const { data: session } = useSession();

  const { data, loading } = useQuery(GET_POST_BY_ID, { variables: { postId } });
  const post: Post = data?.getPost;

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_ID, "getPostById"],
  });

  const resetComment = useCallback(() => {
    setValue("comment", "");
  }, []);
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const notification = toast.loading("Posting your comment...");
    try {
      await addComment({
        variables: {
          post_id: postId,
          username: session?.user?.name,
          text: data.comment,
        },
      });
      resetComment();
      toast.success("Comment successfully posted!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops something went wrong when creating comment.");
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="max-w-5xl mx-auto my-7">
      <Post post={post} />
      <div className="rounded-b-md border border-t-0 border-gray-300 -mt-1 bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-5xl space-y-2"
        >
          <textarea
            {...register("comment")}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pt-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? "What are your thoughts?" : "Please sign in to comment"
            }
          />
          <button
            type="submit"
            className="rounded-full bg-red-500 font-semibold text-white disabled:bg-gray-200 p-3"
          >
            Comment
          </button>
        </form>
      </div>

      <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />
        {post?.commentList.map((comment: Comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default PostPage;
