import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { api } from '../lib/api';
import { CommentItem } from './CommentItem';
import type { Comment, User } from '../types';

interface CommentSectionProps {
  postId: number;
  currentUser: User;
}

export function CommentSection({ postId, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await api.getComments(postId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await api.createComment(postId, content);
      setComments((prev) => [...prev, newComment]);
      setContent('');
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await api.deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span className="text-gray-900">댓글 {comments.length}</span>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] resize-none"
            placeholder="댓글을 입력하세요"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-6 py-2 bg-[#FFCC00] text-gray-900 rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '작성중...' : '댓글 작성'}
            </button>
          </div>
        </form>

        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {loading ? (
            <div className="py-8 text-center text-gray-500">댓글 로딩중...</div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-gray-500">첫 댓글을 작성해보세요</div>
          ) : (
            <div className="px-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}