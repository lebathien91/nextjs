import { format } from "date-fns";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";

import { GlobalContext } from "@/store/GlobalState";
import Avatar from "./Avatar";
import { InputComment } from "./InputComment";

import { postData, putData } from "@/utils/fetchData";
import { IComment, IUser } from "@/utils/interface";

interface IProps {
  children?: ReactNode;
  comment: IComment;
  showReply: IComment[];
  setShowReply: (showReply: IComment[]) => void;
  deleteComment: (comment: IComment) => void;
}
const CommentList = ({
  children,
  comment,
  showReply,
  setShowReply,
  deleteComment,
}: IProps) => {
  const { state, dispatch } = useContext(GlobalContext);
  const { user, token } = state.auth;

  const [onReply, setOnReply] = useState(false);
  const [edit, setEdit] = useState<IComment>();

  const handleReply = async (content: string) => {
    const formData = {
      user,
      articleId: comment.articleId,
      articleUserId: comment.articleUserId,
      content,
      replyComment: [],
      replyUser: comment.user,
      commentRoot: comment.commentRoot || comment._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData(`comment/reply`, formData, token);
    dispatch({ type: "NOTIFY", payload: {} });
    if (res.error) toast.error(res.error, { theme: "colored" });
    const newComment = { ...res.newComment, user };
    setShowReply([...showReply, newComment]);
    setOnReply(false);

    return;
  };

  const handleUpdateComment = async (content: string) => {
    if (edit?.content === content) return setEdit(undefined);

    const updateComment = { ...edit, content };

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await putData(`comment/${comment._id}`, updateComment, token);
    dispatch({ type: "NOTIFY", payload: {} });
    if (res.error) toast.error(res.error, { theme: "colored" });

    comment.content = content;
    setEdit(undefined);
  };

  return (
    <>
      {!edit && <Avatar user={comment.user as IUser} size={8} />}
      <div className="w-full">
        {edit ? (
          <InputComment
            edit={edit}
            setEdit={setEdit}
            callback={handleUpdateComment}
          />
        ) : (
          <div className="flex items-center justify-start space-x-2 mb-2">
            <div className="block min-w-[250px]">
              <div className="bg-gray-100 w-auto rounded-xl px-2 pb-2">
                <div className="font-medium flex justify-between items-center py-1">
                  <a
                    href="#"
                    className={`hover:underline font-bold text-md ${
                      (comment.user as IUser).root
                        ? "text-red-600"
                        : "text-sky-600"
                    }`}
                  >
                    <small>{(comment.user as IUser)?.username}</small>
                  </a>
                  {user &&
                    (user.root ||
                      user.role === "admin" ||
                      (comment.user as IUser)._id === user._id) && (
                      <div>
                        <a
                          className="inline-block cursor-pointer text-sky-700 mr-2"
                          onClick={() => setEdit(comment)}
                        >
                          <BiEdit size={18} />
                        </a>
                        <a
                          className="inline-block cursor-pointer text-red-600"
                          onClick={() =>
                            dispatch({
                              type: "NOTIFY",
                              payload: {
                                modal: {
                                  title: "Xóa bình luận",
                                  message:
                                    "Bạn có chắn chắn muốn xóa bình luận",
                                  handleSure: () => deleteComment(comment),
                                },
                              },
                            })
                          }
                        >
                          <BiTrash size={18} />
                        </a>
                      </div>
                    )}
                </div>
                <div className="text-md">{comment.content}</div>
              </div>
              <div className="flex justify-start items-center text-sm">
                <div className="w-full font-semibold text-gray-700 px-2 flex items-center justify-between space-x-1">
                  <button
                    className="hover:underline"
                    onClick={() => setOnReply(!onReply)}
                  >
                    <small>{onReply ? "Cancel" : "Reply"}</small>
                  </button>

                  <a href="#" className="hover:underline">
                    <small>
                      {format(
                        new Date(comment.createdAt as string),
                        "dd/MM/yy"
                      )}
                    </small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {onReply && (
          <InputComment callback={handleReply} setOnReply={setOnReply} />
        )}
        {children}
      </div>
    </>
  );
};

export default CommentList;
