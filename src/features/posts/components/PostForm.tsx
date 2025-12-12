import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../../../lib/api';
import type { Post } from '../../../types';

interface PostFormProps {
  post?: Post;
  postId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const TITLE_MAX = 100;
const CONTENT_MAX = 5000;

export function PostForm({ post, postId, onClose, onSuccess }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPost = async (id: number) => {
      setInitialLoading(true);
      try {
        const data = await api.getPost(id);
        if (!isMounted) return;
        setTitle(data.title);
        setContent(data.content);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || '게시글을 불러오지 못했습니다');
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    if (post) {
      setTitle(post.title);
      setContent(post.content);
      return () => {
        isMounted = false;
      };
    }

    if (postId) {
      loadPost(postId);
    }

    return () => {
      isMounted = false;
    };
  }, [post, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const targetId = post?.articleId ?? postId;
      if (targetId) {
        await api.updatePost(targetId, title, content);
      } else {
        await api.createPost(title, content);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || '게시글 저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="flex-1 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#FFCC00] mb-1">{post ? 'Edit Post' : 'Write Post'}</p>
              <h2 className="text-gray-900 text-xl font-semibold">{post ? '게시글 수정' : '새 게시글 작성'}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col px-6 py-5 space-y-4 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">제목</label>
                  <span className="text-xs text-gray-500">
                    {title.length}/{TITLE_MAX}
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={TITLE_MAX}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                  placeholder="게시글 제목을 입력하세요"
                  required
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">내용</label>
                  <span className="text-xs text-gray-500">
                    {content.length}/{CONTENT_MAX}
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={CONTENT_MAX}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent resize-none"
                  placeholder="게시글 내용을 입력하세요"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#FFCC00] text-gray-900 rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '저장중...' : post ? '수정' : '작성'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
