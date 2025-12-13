export interface User {
  userId: number;
  nickname: string;
  email: string;
}

export interface Post {
  articleId: number;
  title: string;
  content: string;
  writerId: number;
  writerName: string;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostPreview {
  articleId: number;
  title: string;
  contentPreview: string;
  writerId: number;
  writerName: string;
  createdAt: string;
}

export interface Writer {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  articleId: number;
  content: string;
  writer: Writer;
  createdAt: string;
  updatedAt: string;
  parentId?: number | null;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: TokenInfo;
    user: User;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    createdAt: string;
  };
}

export interface ApiMessageResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PostsResponse {
  posts: PostPreview[];
  nextCursor: number | null;
  hasMore: boolean;
}

export type SortOption = 'latest' | 'views' | 'comments';
