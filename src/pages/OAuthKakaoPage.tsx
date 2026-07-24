import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/apis/auth';
import useUserStore from '@/store/userStore';
import Loading from '@/components/common/Loading/Loading';

const OAuthKakaoPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setTokens = useUserStore((state) => state.setTokens);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const code = params.get('code');
    if (!code) {
      navigate('/', { replace: true });
      return;
    }

    authApi
      .kakaoLogin(code)
      .then((result) => {
        if (result.nextStep === 'SIGNUP_REQUIRED' && result.signupToken) {
          sessionStorage.setItem('salpim-kakao-signup-token', result.signupToken);
          navigate('/onboarding', { replace: true });
          return;
        }

        if (!result.accessToken || !result.refreshToken) {
          throw new Error('로그인 토큰이 없습니다.');
        }

        sessionStorage.removeItem('salpim-kakao-signup-token');
        setTokens(result.accessToken, result.refreshToken);
        navigate('/recommendation', { replace: true });
      })
      // TODO: 로그인 실패 UI 처리
      .catch(() => navigate('/', { replace: true }));
  }, [params, navigate, setTokens]);

  return <Loading fullScreen text="로그인 중..." />;
};

export default OAuthKakaoPage;
