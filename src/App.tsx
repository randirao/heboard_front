import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { PostForm } from './components/PostForm';
import { authService } from './lib/auth';
import type { User, Post } from './types';

type View = 'list' | 'detail';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('list');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
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
    setShowPostForm(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handlePostFormClose = () => {
    setShowPostForm(false);
    setEditingPost(null);
  };

  const handlePostFormSuccess = () => {
    setShowPostForm(false);
    setEditingPost(null);
    setView('list');
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
    <div className="h-screen flex flex-col bg-gray-50">
      <Header user={user} onLogout={handleLogout} onCreatePost={handleCreatePost} />

      {view === 'list' && (
        <PostList onPostClick={handlePostClick} refreshTrigger={refreshTrigger} />
      )}

      {view === 'detail' && selectedPost && (
        <PostDetail
          postId={selectedPost.id}
          currentUser={user}
          onBack={handleBackToList}
          onEdit={handleEditPost}
          onDelete={handlePostDelete}
        />
      )}

      {showPostForm && (
        <PostForm
          post={editingPost || undefined}
          onClose={handlePostFormClose}
          onSuccess={handlePostFormSuccess}
        />
      )}
    </div>
  );
}
