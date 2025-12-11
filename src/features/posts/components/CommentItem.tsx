import { Trash2 } from 'lucide-react';
import type { Comment, User } from '../../../types';

interface CommentItemProps {
  comment: Comment;
  currentUser: User;
  onDelete: (commentId: number) => void;
}

export function CommentItem({ comment, currentUser, onDelete }: CommentItemProps) {
  const isAuthor = currentUser.userId === comment.writer.id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
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
    <div className="py-4 border-b border-gray-100 last:border-0">
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
    </div>
  );
}
