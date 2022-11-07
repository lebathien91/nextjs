import { useEffect, useState } from "react";

import CommentList from "./CommentList";
import { IComment } from "@/utils/interface";

interface IProps {
  comment: IComment;
  deleteComment: (comment: IComment) => void;
}

const Comment = ({ comment, deleteComment }: IProps) => {
  const [showReply, setShowReply] = useState<IComment[]>([]);
  const [moreReplyComment, setMoreReplyComment] = useState<number>(2);

  useEffect(() => {
    if (!comment.replyComment) return;
    setShowReply(comment.replyComment);
  }, [comment.replyComment]);

  return (
    <div className="flex items-center space-x-2 mb-2">
      <CommentList
        comment={comment}
        showReply={showReply}
        setShowReply={setShowReply}
        deleteComment={deleteComment}
      >
        {showReply.slice(0, moreReplyComment).map((commentReply, i) => (
          <div
            key={commentReply._id}
            className="flex items-center space-x-2 mb-2"
          >
            <CommentList
              comment={commentReply}
              showReply={showReply}
              setShowReply={setShowReply}
              deleteComment={deleteComment}
            />
          </div>
        ))}
        <div className="pl-12 cursor-pointer text-sky-700">
          {showReply.length - moreReplyComment > 0 ? (
            <small onClick={() => setMoreReplyComment((pre) => pre + 5)}>
              See more comments...
            </small>
          ) : (
            showReply.length > 2 && (
              <small onClick={() => setMoreReplyComment(2)}>
                Hide comments...
              </small>
            )
          )}
        </div>
      </CommentList>
    </div>
  );
};

export default Comment;
