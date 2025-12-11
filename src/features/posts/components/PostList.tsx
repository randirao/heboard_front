import { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { PostItem } from './PostItem';
import { SearchBar } from './SearchBar';
import { MainHero } from './MainHero';
import type { Post, SortOption } from '../../../types';

interface PostListProps {
  onPostClick: (post: Post) => void;
  refreshTrigger: number;
}

export function PostList({ onPostClick, refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>('latest');
  const [search, setSearch] = useState('');
  const [showHero, setShowHero] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadPosts = async (reset: boolean = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const response = await api.getPosts(
        reset ? undefined : cursor || undefined,
        20,
        sort,
        search || undefined
      );

      if (reset) {
        setPosts(response.posts);
      } else {
        setPosts((prev) => [...prev, ...response.posts]);
      }

      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (err: any) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, cursor]);

  // Initial load and refresh on search/sort change
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    loadPosts(true);
    
    // Hide hero when searching or sorting
    setShowHero(!search && sort === 'latest');
  }, [sort, search, refreshTrigger]);

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {showHero && <MainHero onPostClick={onPostClick} />}
      
      <SearchBar
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        currentSort={sort}
      />

      <div className="flex-1 overflow-y-auto">
        {!showHero && (
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-gray-900">
                {search ? `'${search}' 검색 결과` : sort === 'views' ? '조회수순' : sort === 'comments' ? '댓글수순' : '전체 게시글'}
              </h3>
            </div>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            게시글이 없습니다
          </div>
        )}

        {posts.map((post) => (
          <PostItem key={post.articleId} post={post} onClick={() => onPostClick(post)} />
        ))}

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFCC00]" />
          </div>
        )}

        <div ref={observerTarget} className="h-4" />
      </div>
    </div>
  );
}
