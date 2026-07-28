import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getKakaoAuthorizeUrl } from '@/apis/auth';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FontSizeSettings from '@/features/mypage/FontSizeSettings';

type FontSize = 'medium' | 'large';
type NextPage = 'login' | 'kakao' | 'signup';

const FONT_SIZE_STORAGE_KEY = 'salpim-font-size';

const FontSizePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return localStorage.getItem(FONT_SIZE_STORAGE_KEY) === 'large' ? 'large' : 'medium';
  });
  const [kakaoLoginError, setKakaoLoginError] = useState('');

  const next = searchParams.get('next') as NextPage | null;
  const isLarge = fontSize === 'large';

  if (!next) {
    return (
      <div className="mypage-screen mx-auto max-w-md">
        <HeaderBar title="글자 크기 설정" />
        <FontSizeSettings />
        <BottomNavigation />
      </div>
    );
  }

  const handleSave = () => {
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    setKakaoLoginError('');

    if (next === 'kakao') {
      try {
        window.location.href = getKakaoAuthorizeUrl();
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[kakao] invalid authorization configuration', error);
        }
        setKakaoLoginError(
          '카카오 로그인 설정을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.'
        );
      }
      return;
    }

    if (next === 'signup') {
      sessionStorage.removeItem('salpim-kakao-signup-token');
      navigate('/onboarding');
      return;
    }

    navigate('/?step=login');
  };

  return (
    <div className="min-h-[100svh] w-full bg-[#FAF8F3]">
      <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] text-[#613212]">
        <section className="flex min-h-0 flex-1 flex-col">
          <img
            src="/assets/Salpimi/Talk.png"
            alt="살피미"
            className="mx-auto h-[clamp(56px,7.88vh,64px)] w-[clamp(56px,7.88vh,64px)] object-contain"
          />

          <h1 className="mt-3 text-center text-[clamp(24px,3.45vh,28px)] font-semibold leading-[1.35]">
            원하시는 글자 크기를
            <br />
            선택해 주세요!
          </h1>

          <div className="mt-5 grid grid-cols-2 gap-4 px-1">
            <button
              type="button"
              aria-pressed={!isLarge}
              onClick={() => setFontSize('medium')}
              className={`aspect-[160/136] rounded-[32px] !text-[clamp(32px,4.43vh,36px)] !font-semibold shadow-[0_4px_8px_rgba(97,50,18,0.15)] transition-colors ${
                !isLarge ? 'bg-[#FFB800] text-[#292929]' : 'bg-[#FFF0D8] text-[#292929]'
              }`}
            >
              중간
            </button>
            <button
              type="button"
              aria-pressed={isLarge}
              onClick={() => setFontSize('large')}
              className={`aspect-[160/136] rounded-[32px] !text-[clamp(40px,5.42vh,44px)] !font-semibold shadow-[0_4px_8px_rgba(97,50,18,0.15)] transition-colors ${
                isLarge ? 'bg-[#FFB800] text-[#292929]' : 'bg-[#FFF0D8] text-[#292929]'
              }`}
            >
              크게
            </button>
          </div>

          <h2 className="mt-3 px-4 text-[clamp(22px,2.96vh,24px)] font-semibold">미리보기</h2>
          <div className="mt-2 min-h-[clamp(200px,25vh,220px)] rounded-xl border border-[#D9D9D9] bg-white px-4 py-4 text-[#292929]">
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

        <button
          type="button"
          onClick={handleSave}
          className="mt-6 h-[clamp(72px,9.85vh,80px)] w-full shrink-0 rounded-xl bg-[#FF843D] !text-[clamp(28px,3.69vh,30px)] !font-semibold text-white"
        >
          저장하기
        </button>
        {kakaoLoginError && (
          <p role="alert" className="mt-3 text-center text-sm font-semibold text-red-500">
            {kakaoLoginError}
          </p>
        )}
      </main>
    </div>
  );
};

export default FontSizePage;
