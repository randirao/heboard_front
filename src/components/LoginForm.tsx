import { useEffect, useState } from 'react';
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
  const [info, setInfo] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verifyToken');

    if (!token) {
      return;
    }

    setVerificationStatus('pending');
    setVerificationMessage('이메일 인증을 확인하는 중입니다...');

    api.verifyEmail(token)
      .then((response) => {
        setVerificationStatus('success');
        setVerificationMessage(response.message || '이메일 인증이 완료되었습니다. 로그인해주세요.');
        setIsLogin(true);
        setInfo('이메일 인증이 완료되었습니다. 로그인 정보를 입력해주세요.');
      })
      .catch((err: any) => {
        setVerificationStatus('error');
        setVerificationMessage(err.message || '이메일 인증에 실패했습니다. 다시 시도해주세요.');
      })
      .finally(() => {
        params.delete('verifyToken');
        const rest = params.toString();
        const nextUrl = rest ? `${window.location.pathname}?${rest}` : window.location.pathname;
        window.history.replaceState({}, '', nextUrl);
      });
  }, []);

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
        await api.register(nickname, email, password);
        setInfo('인증 메일을 보냈습니다. 이메일을 확인한 후 로그인해주세요. 메일이 오지 않으면 아래 재전송을 눌러주세요.');
        setIsLogin(true);
        setIdentifier(email);
        setPassword('');
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
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                isLogin
                  ? 'bg-[#FFCC00] text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setInfo('');
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isLogin
                  ? 'bg-[#FFCC00] text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              회원가입
            </button>
          </div>

          {verificationStatus !== 'idle' && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg border ${
                verificationStatus === 'pending'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : verificationStatus === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {verificationMessage}
            </div>
          )}

          {info && (
            <div className="mb-4 px-4 py-3 rounded-lg border bg-yellow-50 text-yellow-800 border-yellow-200">
              {info}
            </div>
          )}

          {isLogin && (
            <div className="mb-2 text-right">
              <button
                type="button"
                onClick={async () => {
                  if (!identifier) {
                    setError('이메일을 입력한 뒤 재전송을 눌러주세요.');
                    return;
                  }
                  setError('');
                  setInfo('');
                  setResendLoading(true);
                  try {
                    const res = await api.resendVerificationEmail(identifier);
                    setInfo(res.message || '인증 메일을 재발송했습니다.');
                  } catch (err: any) {
                    setError(err.message || '재전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
                  } finally {
                    setResendLoading(false);
                  }
                }}
                className="text-sm text-gray-600 hover:text-gray-900 underline disabled:opacity-50"
                disabled={resendLoading}
              >
                {resendLoading ? '재전송 중...' : '인증 메일 다시 보내기'}
              </button>
            </div>
          )}

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
