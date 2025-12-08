export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  authorId: string;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: User;
  authorId: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type SortOption = 'latest' | 'views' | 'comments';
