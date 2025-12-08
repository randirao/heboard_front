import { authService } from './auth';
import { mockApi } from './mockData';
import type { AuthResponse, PostsResponse, Post, Comment, SortOption } from '../types';

// TODO: Replace with your actual backend API URL
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = true;

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

    return response.json();
  }

  // Auth
  async login(username: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      return mockApi.login(username, password);
    }
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      return mockApi.register(username, email, password);
    }
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  // Posts
  async getPosts(
    cursor?: string,
    limit: number = 20,
    sort: SortOption = 'latest',
    search?: string
  ): Promise<PostsResponse> {
    if (USE_MOCK_DATA) {
      return mockApi.getPosts(cursor, limit, sort, search);
    }
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());
    params.append('sort', sort);
    if (search) params.append('search', search);

    return this.request<PostsResponse>(`/posts?${params.toString()}`);
  }

  async getPost(id: string): Promise<Post> {
    if (USE_MOCK_DATA) {
      return mockApi.getPost(id);
    }
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(title: string, content: string): Promise<Post> {
    if (USE_MOCK_DATA) {
      return mockApi.createPost(title, content);
    }
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
  }

  async updatePost(id: string, title: string, content: string): Promise<Post> {
    if (USE_MOCK_DATA) {
      return mockApi.updatePost(id, title, content);
    }
    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    });
  }

  async deletePost(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockApi.deletePost(id);
    }
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    if (USE_MOCK_DATA) {
      return mockApi.getComments(postId);
    }
    return this.request<Comment[]>(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, content: string): Promise<Comment> {
    if (USE_MOCK_DATA) {
      return mockApi.createComment(postId, content);
    }
    return this.request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      return mockApi.deleteComment(postId, commentId);
    }
    return this.request<void>(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();