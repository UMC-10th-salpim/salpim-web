import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getKakaoAuthorizeUrl } from '@/apis/auth';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FontSizeSettings from '@/features/mypage/FontSizeSettings';
import useSettingsStore from '@/store/settingsStore';
import type { FontSize } from '@/store/settingsStore';

type NextPage = 'login' | 'kakao' | 'kakao-signup' | 'signup';

const FontSizePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const savedFontSize = useSettingsStore((state) => state.fontSize);
  const saveFontSize = useSettingsStore((state) => state.setFontSize);
  const [fontSize, setFontSize] = useState<FontSize>(savedFontSize);
  const [kakaoLoginError, setKakaoLoginError] = useState('');

  const next = searchParams.get('next') as NextPage | null;
  const isLarge = fontSize === 'large';
  const isMyPageRoute = location.pathname === '/mypage/font-size';

  const handleBack = () => {
    if (next === 'kakao-signup') {
      sessionStorage.removeItem('salpim-kakao-signup-token');
    }
    navigate('/');
  };

  if (!next) {
    return (
      <div className="mypage-screen mx-auto max-w-md">
        <HeaderBar
          title="글자 크기 설정"
          onBack={() => navigate(isMyPageRoute ? '/mypage' : '/')}
        />
        <FontSizeSettings />
        <BottomNavigation />
      </div>
    );
  }

  const handleSave = () => {
    saveFontSize(fontSize);
    setKakaoLoginError('');

    if (next === 'kakao') {
      try {
        window.location.href = getKakaoAuthorizeUrl();
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[kakao] invalid authorization configuration', error);
        }
        setKakaoLoginError('카카오 로그인 설정을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
      return;
    }

    if (next === 'signup') {
      sessionStorage.removeItem('salpim-kakao-signup-token');
      navigate('/onboarding');
      return;
    }

    if (next === 'kakao-signup') {
      const signupToken = sessionStorage.getItem('salpim-kakao-signup-token');
      if (!signupToken) {
        navigate('/', { replace: true });
        return;
      }

      navigate('/onboarding');
      return;
    }

    navigate('/?step=login');
  };

  return (
    <div className="min-h-[100svh] w-full overflow-y-auto bg-[#FAF8F3]">
      <main className="relative mx-auto min-h-[788px] w-full max-w-[375px] text-[#613212]">
        <section>
          <img
            src="/assets/Salpimi/Talk.png"
            alt="살피미"
            className="absolute left-[147.5px] top-8 size-20 object-contain"
          />

          <h1 className="absolute inset-x-0 top-[110px] text-center text-[28px] font-semibold leading-[1.28]">
            원하시는 글자 크기를
            <br />
            선택해 주세요!
          </h1>

          <div
            className={`absolute left-[19.5px] grid grid-cols-[160px_160px] gap-4 ${isLarge ? 'top-[194px]' : 'top-52'}`}
          >
            <button
              type="button"
              aria-pressed={!isLarge}
              onClick={() => setFontSize('medium')}
              className={`h-[136px] w-40 rounded-[32px] !text-[36px] !font-semibold shadow-[0_4px_8px_rgba(97,50,18,0.15)] transition-colors ${
                !isLarge ? 'bg-[#FFB800] text-[#292929]' : 'bg-[#FFF0D8] text-[#292929]'
              }`}
            >
              중간
            </button>
            <button
              type="button"
              aria-pressed={isLarge}
              onClick={() => setFontSize('large')}
              className={`h-[136px] w-40 rounded-[32px] !text-[44px] !font-semibold shadow-[0_4px_8px_rgba(97,50,18,0.15)] transition-colors ${
                isLarge ? 'bg-[#FFB800] text-[#292929]' : 'bg-[#FFF0D8] text-[#292929]'
              }`}
            >
              크게
            </button>
          </div>

          <h2
            className={`absolute left-4 text-[24px] font-semibold ${isLarge ? 'top-[336px]' : 'top-[358px]'}`}
          >
            미리보기
          </h2>
          <div
            className={`absolute left-[16.5px] w-[342px] rounded-xl border border-[#D9D9D9] bg-white px-4 py-4 text-[#292929] ${
              isLarge ? 'top-[375.5px] h-[221px]' : 'top-[397.5px] h-[199px]'
            }`}
          >
            <p className={`${isLarge ? 'text-[40px]' : 'text-[32px]'} font-semibold leading-[1.2]`}>
              노인 의료비 지원
            </p>
            <p
              className={`${isLarge ? 'mt-3 text-[30px]' : 'mt-2 text-[24px]'} font-semibold leading-[1.35]`}
            >
              병원 갈 때 드는 돈을 나라에서 일부 도와주는 제도예요!
            </p>
          </div>
        </section>

        <div className="absolute left-[22px] top-[684px] flex gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="h-20 w-[157px] rounded-xl bg-[#FF843D] !text-[30px] !font-semibold text-white"
          >
            이전
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-20 w-[157px] rounded-xl bg-[#FF843D] !text-[30px] !font-semibold text-white"
          >
            저장하기
          </button>
        </div>
        {kakaoLoginError && (
          <p
            role="alert"
            className="absolute inset-x-4 top-[770px] text-center text-sm font-semibold text-red-500"
          >
            {kakaoLoginError}
          </p>
        )}
      </main>
    </div>
  );
};

export default FontSizePage;
