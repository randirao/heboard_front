import { Eye, MessageSquare } from 'lucide-react';
import { useNow } from '../../../lib/useNow';
import type { Post } from '../../../types';

interface PostItemProps {
  post: Post;
  onClick: () => void;
}

export function PostItem({ post, onClick }: PostItemProps) {
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
      <div className="flex items-center gap-3 text-gray-500">
        <span>{post.writerName}</span>
        <span className="text-gray-300">•</span>
        <span>{formatDate(post.createdAt)}</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
            <Eye className="w-3.5 h-3.5" />
            {post.viewCount}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            {post.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}
