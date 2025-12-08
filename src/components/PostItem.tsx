import { Eye, MessageSquare } from 'lucide-react';
import type { Post } from '../types';

interface PostItemProps {
  post: Post;
  onClick: () => void;
}

export function PostItem({ post, onClick }: PostItemProps) {
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
    } else if (hours < 48) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border-b border-gray-200 px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <h3 className="text-gray-900 mb-2">{post.title}</h3>
      <div className="flex items-center gap-4 text-gray-500">
        <span>{post.author.username}</span>
        <span>{formatDate(post.createdAt)}</span>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
