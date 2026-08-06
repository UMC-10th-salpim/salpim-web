import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi, getKakaoLoginErrorMessage } from '@/apis/auth';
import { mypageApi } from '@/apis/mypage';
import useUserStore from '@/store/userStore';

const PROFILE_LOAD_ERROR_MESSAGE =
  '로그인은 완료됐지만 회원 이름을 불러오지 못했습니다. 다시 시도해 주세요.';

const normalizeName = (name: unknown) => (typeof name === 'string' ? name.trim() : '');

const OAuthKakaoPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setTokens = useUserStore((state) => state.setTokens);
  const setName = useUserStore((state) => state.setName);
  const setHomeLocation = useUserStore((state) => state.setHomeLocation);
  const logout = useUserStore((state) => state.logout);
  const handled = useRef(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const code = params.get('code');
    if (!code) {
      setErrorMessage('카카오 인가 코드가 필요합니다');
      return;
    }

    authApi
      .kakaoLogin(code)
      .then(async (result) => {
        if (result.isNewMember && result.nextStep === 'SIGNUP_REQUIRED' && result.signupToken) {
          sessionStorage.setItem('salpim-kakao-signup-token', result.signupToken);
          navigate('/onboarding', { replace: true });
          return;
        }

        if (
          result.isNewMember ||
          result.nextStep !== 'LOGIN_COMPLETE' ||
          !result.accessToken ||
          !result.refreshToken
        ) {
          throw new Error('로그인 토큰이 없습니다.');
        }

        sessionStorage.removeItem('salpim-kakao-signup-token');
        setTokens(result.accessToken, result.refreshToken);
        const pendingHomeLocation = sessionStorage.getItem('salpim-pending-home-location');
        if (pendingHomeLocation) {
          try {
            const parsed = JSON.parse(pendingHomeLocation) as {
              latitude?: unknown;
              longitude?: unknown;
            };
            if (
              typeof parsed.latitude === 'number' &&
              Number.isFinite(parsed.latitude) &&
              typeof parsed.longitude === 'number' &&
              Number.isFinite(parsed.longitude)
            ) {
              setHomeLocation(parsed.latitude, parsed.longitude);
            }
          } catch {
            // 이전 가입 흐름의 잘못된 임시값은 무시한다.
          }
          sessionStorage.removeItem('salpim-pending-home-location');
        }

        const loginResponseName = normalizeName(result.name);

        try {
          // 카카오 로그인 응답에는 이름이 없으므로 인증 토큰으로 회원 정보를 다시 조회한다.
          const profile = await mypageApi.getSummary();
          const profileName = normalizeName(profile.name);
          const resolvedName = profileName || loginResponseName;

          if (!resolvedName) throw new Error(PROFILE_LOAD_ERROR_MESSAGE);
          setName(resolvedName);
        } catch {
          // 이전 버전 서버가 로그인 응답에 이름을 내려준 경우에는 그 값을 예비값으로 사용한다.
          if (loginResponseName) {
            setName(loginResponseName);
          } else {
            logout();
            throw new Error(PROFILE_LOAD_ERROR_MESSAGE);
          }
        }

        navigate('/recommendation', { replace: true });
      })
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error && error.message === PROFILE_LOAD_ERROR_MESSAGE
            ? error.message
            : getKakaoLoginErrorMessage(error, '카카오 로그인에 실패했습니다. 다시 시도해 주세요.')
        );
      });
  }, [params, navigate, logout, setHomeLocation, setName, setTokens]);

  if (errorMessage) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-brand-50 px-6">
        <section className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[#613212]">카카오 로그인 실패</h1>
          <p role="alert" className="mt-3 text-lg font-medium leading-7 text-red-500">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="mt-6 w-full rounded-2xl bg-[#FF8A3D] py-4 !text-xl !font-semibold text-white"
          >
            처음으로 돌아가기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-[100svh] items-center justify-center bg-brand-50"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="h-9 w-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
        <span className="text-lg font-medium text-gray-500">로그인 중...</span>
      </div>
    </main>
  );
};

export default OAuthKakaoPage;
