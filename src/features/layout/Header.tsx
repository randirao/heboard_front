import { LogOut, PenSquare } from 'lucide-react';
import { authService } from '../../lib/auth';
import type { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onCreatePost: () => void;
}

export function Header({ user, onLogout, onCreatePost }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-[#FFCC00] cursor-pointer" onClick={() => window.location.reload()}>
          heboard
        </h1>
        
        {user && (
          <div className="flex items-center gap-3">
            <button
              onClick={onCreatePost}
              className="flex items-center gap-2 px-4 py-2 bg-[#FFCC00] text-gray-900 rounded-lg hover:bg-[#E6B800] transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              글쓰기
            </button>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">{user.nickname}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
