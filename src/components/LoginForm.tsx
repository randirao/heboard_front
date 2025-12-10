import { useState } from 'react';
import { api } from '../lib/api';
import { authService } from '../lib/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // 로그인 (이메일 또는 닉네임)
        const response = await api.login(identifier, password);
        authService.setTokens(response.data.token.accessToken, response.data.token.refreshToken);
        authService.setUser(response.data.user);
        onLoginSuccess();
      } else {
        // 회원가입 후 자동 로그인 (이메일로)
        await api.register(nickname, email, password);
        const loginResponse = await api.login(email, password);  // 회원가입 시 입력한 이메일 사용
        authService.setTokens(loginResponse.data.token.accessToken, loginResponse.data.token.refreshToken);
        authService.setUser(loginResponse.data.user);
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || (isLogin ? '로그인에 실패했습니다' : '회원가입에 실패했습니다'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-[#FFCC00] mb-2">heboard</h1>
          <p className="text-gray-600">자유 게시판</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                isLogin
                  ? 'bg-[#FFCC00] text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isLogin
                  ? 'bg-[#FFCC00] text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 mb-1">닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                  required
                />
              </div>
            )}

            {isLogin ? (
              <div>
                <label className="block text-gray-700 mb-1">이메일 또는 닉네임</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                  placeholder="이메일 또는 닉네임을 입력하세요"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                required
                minLength={8}
                maxLength={20}
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  8~20자 사이로 입력해주세요. 영문, 숫자, 특수기호(!@#$%^&*) 사용 가능합니다.
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFCC00] text-gray-900 rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리중...' : isLogin ? '로그인' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}