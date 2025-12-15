import { useEffect, useMemo, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { api } from '../../../lib/api';
import { CommentItem, CommentWithChildren } from './CommentItem';
import type { Comment, User } from '../../../types';

interface CommentSectionProps {
  postId: number;
  currentUser: User;
}

export function CommentSection({ postId, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

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

  const handleReplyStart = (commentId: number) => {
    setReplyTargetId((prev) => (prev === commentId ? null : commentId));
    setReplyContent('');
  };

  const handleReplySubmit = async (parentId: number) => {
    if (!replyContent.trim()) return;
    setReplySubmitting(true);
    try {
      const newComment = await api.createComment(postId, replyContent, parentId);
      setComments((prev) => [...prev, newComment]);
      setReplyContent('');
      setReplyTargetId(null);
    } catch (err) {
      console.error('Failed to create reply:', err);
    } finally {
      setReplySubmitting(false);
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

  const handleEditStart = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
    setReplyTargetId(null);
    setReplyContent('');
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleEditSubmit = async (commentId: number) => {
    if (!editContent.trim()) return;

    if (editContent === comments.find(c => c.id === commentId)?.content) {
      handleEditCancel();
      return;
    }

    setEditSubmitting(true);
    try {
      const updatedComment = await api.updateComment(commentId, editContent);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditingCommentId(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to update comment:', err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const threadedComments = useMemo(() => buildTree(comments), [comments]);

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
            <CommentTree
              comments={threadedComments}
              currentUser={currentUser}
              onDelete={handleDelete}
              onEdit={handleEditStart}
              editingCommentId={editingCommentId}
              editContent={editContent}
              setEditContent={setEditContent}
              onEditSubmit={handleEditSubmit}
              onEditCancel={handleEditCancel}
              editSubmitting={editSubmitting}
              onReplyStart={handleReplyStart}
              replyTargetId={replyTargetId}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onReplySubmit={handleReplySubmit}
              replySubmitting={replySubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function buildTree(flat: Comment[]): CommentWithChildren[] {
  const map = new Map<number, CommentWithChildren>();
  const roots: CommentWithChildren[] = [];
  flat.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });
  flat.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function CommentTree({
  comments,
  currentUser,
  onDelete,
  onEdit,
  editingCommentId,
  editContent,
  setEditContent,
  onEditSubmit,
  onEditCancel,
  editSubmitting,
  onReplyStart,
  replyTargetId,
  replyContent,
  setReplyContent,
  onReplySubmit,
  replySubmitting,
}: {
  comments: CommentWithChildren[];
  currentUser: User;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  editingCommentId: number | null;
  editContent: string;
  setEditContent: (v: string) => void;
  onEditSubmit: (id: number) => void;
  onEditCancel: () => void;
  editSubmitting: boolean;
  onReplyStart: (id: number) => void;
  replyTargetId: number | null;
  replyContent: string;
  setReplyContent: (v: string) => void;
  onReplySubmit: (parentId: number) => void;
  replySubmitting: boolean;
}) {
  const renderNode = (node: CommentWithChildren, depth: number = 0) => (
    <div key={node.id} className="px-4">
      <CommentItem
        comment={node}
        currentUser={currentUser}
        onDelete={onDelete}
        onEdit={(id) => onEdit(id, node.content)}
        onReply={(id) => onReplyStart(id)}
        depth={depth}
      />
      {editingCommentId === node.id && (
        <div className="mt-2" style={{ paddingLeft: depth ? 20 * (depth + 1) : 20 }}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="댓글을 수정하세요"
            rows={3}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] resize-none"
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              type="button"
              onClick={onEditCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              disabled={editSubmitting || !editContent.trim()}
              onClick={() => onEditSubmit(node.id)}
              className="px-4 py-2 bg-[#FFCC00] text-gray-900 rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editSubmitting ? '수정중...' : '수정 완료'}
            </button>
          </div>
        </div>
      )}
      {replyTargetId === node.id && (
        <div className="mt-2" style={{ paddingLeft: depth ? 20 * (depth + 1) : 20 }}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] resize-none"
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setReplyContent('');
                onReplyStart(node.id);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              disabled={replySubmitting || !replyContent.trim()}
              onClick={() => onReplySubmit(node.id)}
              className="px-4 py-2 bg-[#FFCC00] text-gray-900 rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {replySubmitting ? '작성중...' : '답글 작성'}
            </button>
          </div>
        </div>
      )}
      {node.children && node.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {node.children.map((child) => renderNode(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return <div>{comments.map((c) => renderNode(c))}</div>;
}
