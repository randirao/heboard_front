import { TrendingUp, Clock, Users, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Post } from '../types';

interface MainHeroProps {
  onPostClick: (post: Post) => void;
}

export function MainHero({ onPostClick }: MainHeroProps) {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [articleCount, setArticleCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMainData();
  }, []);

  const loadMainData = async () => {
    setLoading(true);
    try {
      // Load popular posts (by views)
      const popularResponse = await api.getPosts(undefined, 5, 'views');
      setPopularPosts(popularResponse.posts);

      // Load recent posts
      const recentResponse = await api.getPosts(undefined, 5, 'latest');
      setRecentPosts(recentResponse.posts);

      // Load stats
      const statsResponse = await api.getStats();
      setUserCount(statsResponse.data.userCount);
      setArticleCount(statsResponse.data.articleCount);
    } catch (err) {
      console.error('Failed to load main data:', err);
    } finally {
      setLoading(false);
    }
  };

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
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-3">자유롭게 소통하는 공간</h2>
          <p className="text-gray-600">heboard에서 다양한 주제로 이야기를 나눠보세요</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <FileText className="w-6 h-6 mx-auto mb-2 text-[#FFCC00]" />
            <div className="text-gray-900 mb-1">전체 게시글</div>
            <div className="text-gray-600">
              {loading ? '-' : `${articleCount}`}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <Users className="w-6 h-6 mx-auto mb-2 text-[#FFCC00]" />
            <div className="text-gray-900 mb-1">활동 회원</div>
            <div className="text-gray-600">
              {loading ? '-' : `${userCount}`}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#FFCC00]" />
            <div className="text-gray-900 mb-1">오늘 작성</div>
            <div className="text-gray-600">
              {loading ? '-' : `${recentPosts.filter(p => {
                const diff = Date.now() - new Date(p.createdAt).getTime();
                return diff < 24 * 60 * 60 * 1000;
              }).length}`}
            </div>
          </div>
        </div>

        {/* Popular & Recent Posts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Popular Posts */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#FFCC00]" />
              <h3 className="text-gray-900">인기 게시글</h3>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">로딩중...</div>
            ) : popularPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">게시글이 없습니다</div>
            ) : (
              <div className="space-y-3">
                {popularPosts.map((post, index) => (
                  <div
                    key={post.articleId}
                    onClick={() => onPostClick(post)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FFCC00] text-gray-900 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 mb-1 truncate group-hover:text-[#FFCC00] transition-colors">
                        {post.title}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>{post.writerName}</span>
                        <span>·</span>
                        <span>조회 {post.viewCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#FFCC00]" />
              <h3 className="text-gray-900">최신 게시글</h3>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">로딩중...</div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">게시글이 없습니다</div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.articleId}
                    onClick={() => onPostClick(post)}
                    className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="text-gray-900 mb-1 truncate group-hover:text-[#FFCC00] transition-colors">
                      {post.title}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>{post.writerName}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>·</span>
                      <span>댓글 {post.commentCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
