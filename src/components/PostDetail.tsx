import { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, Eye, MessageSquare } from 'lucide-react';
import { api } from '../lib/api';
import { CommentSection } from './CommentSection';
import type { Post, User } from '../types';

interface PostDetailProps {
  postId: string;
  currentUser: User;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDelete: () => void;
}

export function PostDetail({ postId, currentUser, onBack, onEdit, onDelete }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await api.getPost(postId);
      setPost(data);
    } catch (err) {
      console.error('Failed to load post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;

    try {
      await api.deletePost(postId);
      onDelete();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">게시글을 찾을 수 없습니다</div>
      </div>
    );
  }

  const isAuthor = currentUser.id === post.authorId;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            목록으로
          </button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-gray-900 mb-3">{post.title}</h1>
              <div className="flex items-center gap-4 text-gray-500">
                <span>{post.author.username}</span>
                <span>{formatDate(post.createdAt)}</span>
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

            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(post)}
                  className="flex items-center gap-2 px-3 py-2 text-[#FFCC00] hover:bg-[#FFF9E6] rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        <CommentSection postId={post.id} currentUser={currentUser} />
      </div>
    </div>
  );
}