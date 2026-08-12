import { useNavigate } from 'react-router-dom';

const InquiryForm = () => {
  const navigate = useNavigate();

  return (
    <main className="mypage-content items-center px-5 pb-5 pt-8 text-center">
      <img
        src="/assets/Salpimi/Talk.png"
        alt="문의 안내 살피미"
        className="h-[150px] w-[180px] object-contain"
      />

      <p className="mt-6 break-keep text-[21px] font-extrabold leading-7 text-[#613212]">
        궁금한 점을 아래 연락처로
        <br />
        알려 주세요.
      </p>

      <dl className="mt-9 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-left text-[17px] font-extrabold leading-6">
        <dt className="text-[#FFA800]">대표 이메일</dt>
        <dd className="break-all text-[#613212]">
          <a href="mailto:llanng11@naver.com">llanng11@naver.com</a>
        </dd>
        <dt className="text-[#FFA800]">대표 연락처</dt>
        <dd className="text-[#613212]">
          <a href="tel:01035973243">010-3597-3243</a>
        </dd>
      </dl>

      <button
        type="button"
        onClick={() => navigate('/mypage')}
        className="mt-auto min-h-[76px] w-full rounded-[12px] bg-[#FF843D] text-[28px] font-extrabold text-white"
      >
        확인
      </button>
    </main>
  );
};

export default InquiryForm;
