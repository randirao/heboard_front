import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoginForm } from './features/auth';
import { Header } from './features/layout';
import { PostDetail, PostForm, PostList } from './features/posts';
import { authService } from './lib/auth';
import type { User, Post } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLoginSuccess = () => {
    const savedUser = authService.getUser();
    setUser(savedUser);
    navigate('/');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const handleCreatePost = () => {
    navigate('/write');
  };

  const handlePostDelete = () => {
    setRefreshTrigger((prev) => prev + 1);
    navigate('/');
  };

  const handlePostFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    navigate('/');
  };

  const handleBackToList = () => {
    navigate(-1);
  };

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} onLogout={handleLogout} onCreatePost={handleCreatePost} />
      <Routes>
        <Route
          path="/"
          element={<PostList onPostClick={(post) => navigate(`/posts/${post.articleId}`)} refreshTrigger={refreshTrigger} />}
        />
        <Route
          path="/posts/:id"
          element={
            <PostDetailRoute
              currentUser={user}
              onEdit={(post) => navigate(`/posts/${post.articleId}/edit`, { state: { post } })}
              onDelete={handlePostDelete}
              onBack={handleBackToList}
            />
          }
        />
        <Route
          path="/write"
          element={<PostFormRoute onSuccess={handlePostFormSuccess} onClose={handleBackToList} />}
        />
        <Route
          path="/posts/:id/edit"
          element={<PostFormRoute onSuccess={handlePostFormSuccess} onClose={handleBackToList} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function PostDetailRoute({
  currentUser,
  onBack,
  onEdit,
  onDelete,
}: {
  currentUser: User;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDelete: () => void;
}) {
  const { id } = useParams();
  const postId = useMemo(() => Number(id), [id]);

  if (!id || Number.isNaN(postId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <PostDetail
      postId={postId}
      currentUser={currentUser}
      onBack={onBack}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

function PostFormRoute({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const { id } = useParams();
  const { state } = useLocation();
  const postFromState = (state as { post?: Post } | undefined)?.post;
  const postId = id ? Number(id) : undefined;

  if (id && Number.isNaN(postId)) {
    return <Navigate to="/" replace />;
  }

  return <PostForm post={postFromState} postId={postId} onClose={onClose} onSuccess={onSuccess} />;
}
