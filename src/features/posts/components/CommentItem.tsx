import { Trash2, CornerDownRight } from 'lucide-react';
import { useNow } from '../../../lib/useNow';
import type { Comment, User } from '../../../types';

export interface CommentWithChildren extends Comment {
  children?: CommentWithChildren[];
}

interface CommentItemProps {
  comment: CommentWithChildren;
  currentUser: User;
  onDelete: (commentId: number) => void;
  depth?: number;
  onReply?: (commentId: number, writerName: string) => void;
}

export function CommentItem({ comment, currentUser, onDelete, onReply, depth = 0 }: CommentItemProps) {
  const isAuthor = currentUser.userId === comment.writer.id;
  const now = useNow();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diff = now - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  return (
    <div
      className={`py-4 border-b border-gray-100 last:border-0 ${
        depth > 0 ? 'pl-4 border-l border-gray-100' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-900">{comment.writer.name}</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
        </div>
        {isAuthor && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      {onReply && (
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-gray-700"
            onClick={() => onReply(comment.id, comment.writer.name)}
          >
            <CornerDownRight className="w-4 h-4" /> 답글
          </button>
        </div>
      )}
    </div>
  );
}
