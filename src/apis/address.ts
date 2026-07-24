// 카카오 로컬 - 주소 검색 API (도로명/지번)
// 문서: https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-address
// 참고: 로컬 검색용 REST 키는 프론트 노출이 일반적으로 허용되나, 운영에서는 백엔드 프록시 권장.

const KAKAO_LOCAL_URL = 'https://dapi.kakao.com/v2/local/search/address.json';
const PAGE_SIZE = 10;

export interface AddressResult {
  /** 도로명 주소 (없으면 지번 주소) */
  roadAddress: string;
  /** 건물명 (있을 때만) */
  buildingName?: string;
  /** 백엔드 행정구역 resolve API에 전달할 지역 정보 */
  city: string;
  district: string;
  eupMyeonDong: string;
}

export interface AddressSearchResponse {
  results: AddressResult[];
  /** 마지막 페이지 여부 → 더보기 노출 판단 */
  isEnd: boolean;
  /** 전체 검색 결과 수 */
  totalCount: number;
}

interface KakaoDoc {
  address_name: string;
  road_address: {
    address_name: string;
    building_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  } | null;
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  } | null;
}

interface KakaoResponse {
  documents: KakaoDoc[];
  meta: { is_end: boolean; total_count: number };
}

// 개발 편의용 목 데이터 (키가 없을 때 dev 모드에서만 사용)
const mockSearch = (query: string, page: number): AddressSearchResponse => {
  const base = query.trim() || '서울특별시 중구 세종대로';
  const [city = '서울특별시', district = '중구', eupMyeonDong = '태평로1가'] = base.split(/\s+/);
  const results: AddressResult[] = Array.from({ length: 6 }).map((_, index) => ({
    roadAddress: `${base} ${page * 10 + index}`,
    buildingName: index === 0 ? '살핌빌딩' : undefined,
    city,
    district,
    eupMyeonDong,
  }));
  return { results, isEnd: page >= 3, totalCount: 18 };
};

export const searchAddress = async (query: string, page = 1): Promise<AddressSearchResponse> => {
  const key = import.meta.env.VITE_KAKAO_REST_API_KEY;
  if (!key) {
    // 키가 없으면 개발 중에는 목 데이터로 플로우 확인, 운영 빌드에서는 에러
    if (import.meta.env.DEV) {
      console.warn('[address] VITE_KAKAO_REST_API_KEY 없음 → 개발용 목 데이터 반환');
      return mockSearch(query, page);
    }
    throw new Error('VITE_KAKAO_REST_API_KEY 가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    query,
    page: String(page),
    size: String(PAGE_SIZE),
  });

  const res = await fetch(`${KAKAO_LOCAL_URL}?${params.toString()}`, {
    headers: { Authorization: `KakaoAK ${key}` },
  });
  if (!res.ok) throw new Error(`주소 검색 실패 (${res.status})`);

  const data: KakaoResponse = await res.json();
  const results: AddressResult[] = data.documents.map((doc) => {
    const region = doc.address ?? doc.road_address;

    return {
      roadAddress: doc.road_address?.address_name || doc.address_name,
      buildingName: doc.road_address?.building_name || undefined,
      city: region?.region_1depth_name ?? '',
      district: region?.region_2depth_name ?? '',
      eupMyeonDong: region?.region_3depth_name ?? '',
    };
  });

  return {
    results,
    isEnd: data.meta.is_end,
    totalCount: data.meta.total_count,
  };
};
