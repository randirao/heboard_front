import type { User, Post, Comment, AuthResponse, PostsResponse } from '../types';

// Mock users
const mockUsers: User[] = [
  { id: '1', username: '김철수', email: 'kim@example.com' },
  { id: '2', username: '이영희', email: 'lee@example.com' },
  { id: '3', username: '박민수', email: 'park@example.com' },
  { id: '4', username: '정지은', email: 'jung@example.com' },
  { id: '5', username: '최현우', email: 'choi@example.com' },
];

// Current logged in user
let currentUser: User = mockUsers[0];

// Mock posts
let mockPosts: Post[] = [
  {
    id: '1',
    title: 'heboard에 오신 것을 환영합니다!',
    content: '안녕하세요! heboard 자유 게시판입니다.\n\n여러분의 다양한 이야기를 자유롭게 공유해주세요.\n게시글 작성, 댓글 달기, 검색 등 다양한 기능을 사용해보실 수 있습니다.',
    author: mockUsers[0],
    authorId: '1',
    viewCount: 1234,
    commentCount: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    title: '오늘 날씨 정말 좋네요',
    content: '창밖을 보니 하늘이 너무 맑아요.\n산책하기 딱 좋은 날씨인 것 같습니다!',
    author: mockUsers[1],
    authorId: '2',
    viewCount: 892,
    commentCount: 23,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    title: '맛집 추천 받습니다',
    content: '강남역 근처에서 점심 먹을만한 곳 추천해주세요!\n회사 회식 장소를 찾고 있습니다.',
    author: mockUsers[2],
    authorId: '3',
    viewCount: 567,
    commentCount: 31,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '4',
    title: '주말에 뭐하시나요?',
    content: '다가오는 주말 계획 공유해요~\n저는 등산 갈 예정입니다!',
    author: mockUsers[3],
    authorId: '4',
    viewCount: 445,
    commentCount: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '5',
    title: '좋은 책 추천 부탁드립니다',
    content: '요즘 읽을만한 책이 있을까요?\n소설이나 자기계발서 모두 환영합니다.',
    author: mockUsers[4],
    authorId: '5',
    viewCount: 723,
    commentCount: 27,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
  },
  {
    id: '6',
    title: '프로그래밍 공부 방법',
    content: '프로그래밍을 처음 시작하려고 하는데 어떻게 공부하면 좋을까요?\n경험 있으신 분들의 조언 구합니다.',
    author: mockUsers[0],
    authorId: '1',
    viewCount: 998,
    commentCount: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '7',
    title: '오늘 저녁 메뉴 추천',
    content: '저녁으로 뭐 먹을지 고민중이에요.\n여러분은 보통 뭐 드시나요?',
    author: mockUsers[1],
    authorId: '2',
    viewCount: 334,
    commentCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '8',
    title: '운동 시작했어요!',
    content: '오늘부터 헬스장 다니기 시작했습니다.\n같이 운동하시는 분들 파이팅!',
    author: mockUsers[2],
    authorId: '3',
    viewCount: 456,
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
];

// Mock comments
const mockComments: { [postId: string]: Comment[] } = {
  '1': [
    {
      id: 'c1',
      postId: '1',
      content: '게시판 디자인이 깔끔하네요!',
      author: mockUsers[1],
      authorId: '2',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'c2',
      postId: '1',
      content: '잘 사용하겠습니다~',
      author: mockUsers[2],
      authorId: '3',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
  '2': [
    {
      id: 'c3',
      postId: '2',
      content: '정말 날씨 좋죠! 산책 다녀왔어요',
      author: mockUsers[3],
      authorId: '4',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ],
};

// Helper to generate mock token
const generateToken = () => {
  return 'mock_token_' + Math.random().toString(36).substring(7);
};

// Mock API implementation
export const mockApi = {
  // Auth
  login: async (username: string, password: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const user = mockUsers.find(u => u.username === username) || mockUsers[0];
    currentUser = user;
    
    return {
      token: generateToken(),
      user: user,
    };
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username,
      email,
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    
    return {
      token: generateToken(),
      user: newUser,
    };
  },

  // Posts
  getPosts: async (
    cursor?: string,
    limit: number = 20,
    sort: 'latest' | 'views' | 'comments' = 'latest',
    search?: string
  ): Promise<PostsResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredPosts = [...mockPosts];
    
    // Apply search filter
    if (search) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sort === 'views') {
      filteredPosts.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sort === 'comments') {
      filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
    } else {
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // Apply pagination
    const startIndex = cursor ? parseInt(cursor) : 0;
    const posts = filteredPosts.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filteredPosts.length;
    
    return {
      posts,
      nextCursor: hasMore ? String(startIndex + limit) : null,
      hasMore,
    };
  },

  getPost: async (id: string): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    
    // Increment view count
    post.viewCount++;
    
    return post;
  },

  createPost: async (title: string, content: string): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPost: Post = {
      id: String(mockPosts.length + 1),
      title,
      content,
      author: currentUser,
      authorId: currentUser.id,
      viewCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockPosts.unshift(newPost);
    return newPost;
  },

  updatePost: async (id: string, title: string, content: string): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    if (post.authorId !== currentUser.id) throw new Error('Unauthorized');
    
    post.title = title;
    post.content = content;
    post.updatedAt = new Date().toISOString();
    
    return post;
  },

  deletePost: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockPosts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');
    if (mockPosts[index].authorId !== currentUser.id) throw new Error('Unauthorized');
    
    mockPosts.splice(index, 1);
  },

  // Comments
  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockComments[postId] || [];
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment: Comment = {
      id: 'c' + Date.now(),
      postId,
      content,
      author: currentUser,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    
    if (!mockComments[postId]) {
      mockComments[postId] = [];
    }
    mockComments[postId].push(newComment);
    
    // Update comment count
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.commentCount++;
    }
    
    return newComment;
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const comments = mockComments[postId];
    if (!comments) throw new Error('Comment not found');
    
    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) throw new Error('Comment not found');
    if (comments[index].authorId !== currentUser.id) throw new Error('Unauthorized');
    
    comments.splice(index, 1);
    
    // Update comment count
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.commentCount--;
    }
  },
};
