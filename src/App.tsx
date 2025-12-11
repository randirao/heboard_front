import { useState, useEffect } from 'react';
import { LoginForm } from './features/auth';
import { Header } from './features/layout';
import { PostDetail, PostForm, PostList } from './features/posts';
import { authService } from './lib/auth';
import type { User, Post } from './types';

type View = 'list' | 'detail' | 'write';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('list');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLoginSuccess = () => {
    const savedUser = authService.getUser();
    setUser(savedUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('list');
    setSelectedPost(null);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedPost(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setView('write');
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setView('write');
  };

  const handlePostFormClose = () => {
    setView('list');
    setEditingPost(null);
  };

  const handlePostFormSuccess = () => {
    setView('list');
    setEditingPost(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handlePostDelete = () => {
    setView('list');
    setSelectedPost(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} onLogout={handleLogout} onCreatePost={handleCreatePost} />

      {view === 'list' && (
        <PostList onPostClick={handlePostClick} refreshTrigger={refreshTrigger} />
      )}

      {view === 'detail' && selectedPost && (
        <PostDetail
          postId={selectedPost.articleId}
          currentUser={user}
          onBack={handleBackToList}
          onEdit={handleEditPost}
          onDelete={handlePostDelete}
        />
      )}

      {view === 'write' && (
        <PostForm
          post={editingPost || undefined}
          onClose={handlePostFormClose}
          onSuccess={handlePostFormSuccess}
        />
      )}
    </div>
  );
}
