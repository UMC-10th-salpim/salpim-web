import { useNavigate } from 'react-router-dom';

const BenefitSearchForm = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#FAF8F3] p-4 pb-26">
      {/* 탭 */}
      <div className="flex justify-center gap-4 pb-4 mx-11">
        <button
          className="rounded-full px-4 py-3 text-xl font-semibold border border-[#FFD7AA] border-3 text-[#FF8A3D]"
          onClick={() => navigate('/survey')}
        >
          살피미 추천
        </button>
        <button className="rounded-full w-33 px-4 py-3 text-xl font-semibold bg-[#FF8A3D] text-white">
          직접 찾기
        </button>
      </div>

      {/*이름 직접 검색*/}
      <div className="fled flex-col">
        <span className="text-2xl font-extrabold text-[#613212] pl-6 mb-2">혜택 이름 직접 검색</span>
        <div className="border border-3 border-[#FF8A3D] rounded-full bg-[#FBE3BF] gap-2">
          <input
            placeholder='찾고 싶은 혜택을 입력해보세요'
          />
        </div>
      </div>

      {/* TODO: 검색 input, 조건 선택(지역/관심분야/정렬), 결과 확인하기 버튼 이어서 이전 예정 */}
    </div>
  );
};

export default BenefitSearchForm;