import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/apis/auth';
import useUserStore from '@/store/userStore';
import Loading from '@/components/common/Loading/Loading';

const OAuthKakaoPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);
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
        setAuth(result.user, result.accessToken);
        navigate('/recommendation', { replace: true });
      })
      // TODO: 로그인 실패 UI 처리
      .catch(() => navigate('/', { replace: true }));
  }, [params, navigate, setAuth]);

  return <Loading fullScreen text="로그인 중..." />;
};

export default OAuthKakaoPage;
