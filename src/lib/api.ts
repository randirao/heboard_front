import { authService } from './auth';
import { mockApi } from './mockData';
import type { LoginResponse, SignupResponse, PostsResponse, Post, Comment, SortOption } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080/api';

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = false;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authService.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // JWT token expired or invalid
      authService.logout();
      window.location.href = '/';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    // Handle 204 No Content and empty bodies
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const text = await response.text();
    if (!text) return undefined as unknown as T;
    return JSON.parse(text);
  }

  // Auth
  async login(identifier: string, password: string): Promise<LoginResponse> {
    if (USE_MOCK_DATA) {
      return mockApi.login(identifier, password);
    }
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  }

  async register(nickname: string, email: string, password: string): Promise<SignupResponse> {
    if (USE_MOCK_DATA) {
      return mockApi.register(nickname, email, password);
    }
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ nickname, email, password }),
    });
  }

  // Posts
  async getPosts(
    cursor?: number,
    limit: number = 20,
    sort: SortOption = 'latest',
    search?: string
  ): Promise<PostsResponse> {
    if (USE_MOCK_DATA) {
      return mockApi.getPosts(cursor?.toString(), limit, sort, search);
    }
    const params = new URLSearchParams();
    if (cursor) params.append('lastId', cursor.toString());
    params.append('size', limit.toString());
    params.append('sort', sort);
    if (search) {
      params.append('keyword', search);
      params.append('searchType', 'title,content');
    }

    return this.request<PostsResponse>(`/articles?${params.toString()}`);
  }

  async getPost(id: number): Promise<Post> {
    if (USE_MOCK_DATA) {
      return mockApi.getPost(id.toString());
    }
    return this.request<Post>(`/articles/${id}`);
  }

  async createPost(title: string, content: string): Promise<Post> {
    if (USE_MOCK_DATA) {
      return mockApi.createPost(title, content);
    }
    return this.request<Post>('/articles', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
  }

  async updatePost(id: number, title: string, content: string): Promise<Post> {
    if (USE_MOCK_DATA) {
      return mockApi.updatePost(id.toString(), title, content);
    }
    return this.request<Post>(`/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, content }),
    });
  }

  async deletePost(id: number): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockApi.deletePost(id.toString());
    }
    return this.request<void>(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getComments(postId: number): Promise<Comment[]> {
    if (USE_MOCK_DATA) {
      return mockApi.getComments(postId.toString());
    }
    const params = new URLSearchParams();
    params.append('page', '0');
    params.append('size', '100');
    const response = await this.request<{ content: Comment[] }>(`/articles/${postId}/comments?${params.toString()}`);
    return response.content;
  }

  async createComment(postId: number, content: string): Promise<Comment> {
    if (USE_MOCK_DATA) {
      return mockApi.createComment(postId.toString(), content);
    }
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify({ articleId: postId, content }),
    });
  }

  async deleteComment(postId: number, commentId: number): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockApi.deleteComment(postId.toString(), commentId.toString());
    }
    return this.request<void>(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Stats
  async getStats(): Promise<{ data: { userCount: number; articleCount: number } }> {
    return this.request<{ data: { userCount: number; articleCount: number } }>('/stats');
  }
}

export const api = new ApiClient();
