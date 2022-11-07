import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { GlobalContext } from "@/store/GlobalState";
import Comment from "./Comment";
import { InputComment } from "./InputComment";
import { getData, patchData, postData } from "@/utils/fetchData";
import { IComment } from "@/utils/interface";

interface ICommentProps {
  articleId: string;
  articleUserId: string;
}
const Comments = ({ articleId, articleUserId }: ICommentProps) => {
  const { state, dispatch } = useContext(GlobalContext);
  const socket = state.socket;
  const { user, token } = state.auth;
  const [comments, setComments] = useState<Array<IComment>>([]);

  const [page, setPage] = useState<number>(1);
  const [totalComment, setTotalCommnet] = useState<number>(0);
  const limit = 10;
  const totalPage = Math.ceil(totalComment / limit);

  useEffect(() => {
    getData(`comment/article/${articleId}?limit=${page * limit}`)
      .then((res) => {
        setComments(res.comments);
        setTotalCommnet(res.count);
      })
      .catch((error) => {
        console.log(error);
        setComments([]);
        setTotalCommnet(0);
      });
  }, [articleId, page, limit]);

  const handleComment = async (content: string) => {
    const data = {
      articleId,
      articleUserId,
      content,
      replyComment: [],
    };

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData(`comment`, data, token);
    dispatch({ type: "NOTIFY", payload: {} });
    if (res.error) return toast.error(res.error, { theme: "colored" });
  };

  const handleDeleteComment = async (comment: IComment) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await patchData(`comment/${comment._id}`, {}, token);
    dispatch({ type: "NOTIFY", payload: {} });

    if (res.error) return toast.error(res.error, { theme: "colored" });

    return toast.success(res.success, { theme: "colored" });
  };

  useEffect(() => {
    if (!articleId || !socket) return;
    socket.emit("joinRoom", articleId);

    return () => {
      socket.emit("outRoom", articleId);
    };
  }, [socket, articleId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("createComment", (comment: IComment) => {
      setComments((pre) => [comment, ...pre]);
    });

    return () => {
      socket.off("createComment");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("createReplyComment", (comment: IComment) => {
      setComments((pre) => {
        return pre.map((item) =>
          item._id === comment.commentRoot
            ? { ...item, replyComment: [comment, ...item.replyComment] }
            : item
        );
      });
    });

    return () => {
      socket.off("createReplyComment");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("deleteComment", (comment: IComment) => {
      setComments((pre) => {
        if (comment.commentRoot) {
          return pre.map((item) =>
            item._id === comment.commentRoot
              ? {
                  ...item,
                  replyComment: item.replyComment.filter(
                    (repCM) => repCM._id !== comment._id
                  ),
                }
              : item
          );
        } else {
          return pre.filter((item) => item._id !== comment._id);
        }
      });
    });

    return () => {
      socket.off("deleteComment");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("updateComment", (comment: IComment) => {
      setComments((pre) => {
        if (comment.commentRoot) {
          return pre.map((item) =>
            item._id === comment.commentRoot
              ? {
                  ...item,
                  replyComment: item.replyComment.map((repCM) =>
                    repCM._id === comment._id ? comment : repCM
                  ),
                }
              : item
          );
        } else {
          return pre.map((item) => (item._id === comment._id ? comment : item));
        }
      });
    });

    return () => {
      socket.off("updateComment");
    };
  }, [socket]);

  return (
    <div id="comment">
      <h1 className="mt-12">Comment</h1>
      <InputComment callback={handleComment} />
      <div className="w-full h-auto pl-10 py-8 mt-8 flex flex-col space-y-2">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            deleteComment={handleDeleteComment}
          />
        ))}

        {page < totalPage && (
          <div className="container text-center my-4">
            <button
              onClick={() => setPage((pre) => pre + 1)}
              className="px-4 py-2 border-2 border-[#1e73be] hover:bg-[#1e73be] hover:text-white rounded-md uppercase font-semibold translate ease-out duration-500 hover:scale-125"
            >
              Loadmore
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
