// 카카오 로컬 - 주소 검색 API (도로명/지번)
// 문서: https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-address
// 참고: 로컬 검색용 REST 키는 프론트 노출이 일반적으로 허용되나, 운영에서는 백엔드 프록시 권장.

const KAKAO_LOCAL_URL = 'https://dapi.kakao.com/v2/local/search/address.json';
const KAKAO_COORD_TO_ADDRESS_URL = 'https://dapi.kakao.com/v2/local/geo/coord2address.json';
const PAGE_SIZE = 10;

let kakaoMapServicesLoader: Promise<void> | null = null;

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

interface KakaoRoadAddress {
  address_name: string;
  building_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
}

interface KakaoJibunAddress {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
}

interface KakaoDoc {
  address_name: string;
  road_address: KakaoRoadAddress | null;
  address: KakaoJibunAddress | null;
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

/**
 * 브라우저에서 받은 WGS84 좌표를 도로명 주소로 변환한다.
 * 반환값은 주소 검색 결과와 같은 형태라서 이후 지역 조회·회원가입 흐름을 그대로 사용한다.
 */
export const reverseGeocodeAddress = async (
  latitude: number,
  longitude: number
): Promise<AddressResult> => {
  const key = import.meta.env.VITE_KAKAO_REST_API_KEY;
  let restApiError: unknown;

  if (key) {
    try {
      const params = new URLSearchParams({
        x: String(longitude),
        y: String(latitude),
        input_coord: 'WGS84',
      });

      const res = await fetch(`${KAKAO_COORD_TO_ADDRESS_URL}?${params.toString()}`, {
        headers: { Authorization: `KakaoAK ${key}` },
      });
      if (!res.ok) throw new Error(`현재 위치 주소 변환 실패 (${res.status})`);

      const data: KakaoResponse = await res.json();
      const roadAddress = data.documents.find((document) => document.road_address)?.road_address;
      if (roadAddress) return toAddressResult(roadAddress);

      throw new Error('현재 위치의 도로명 주소를 찾을 수 없습니다.');
    } catch (error) {
      restApiError = error;
    }
  }

  try {
    return await reverseGeocodeWithMapSdk(latitude, longitude);
  } catch (mapSdkError) {
    console.warn('[address] Kakao REST API 및 지도 SDK 역지오코딩 실패', {
      restApiError,
      mapSdkError,
    });
    throw new Error(
      '현재 위치를 주소로 변환하지 못했어요. 카카오 REST API 키 또는 지도 JavaScript 키 설정을 확인해 주세요.'
    );
  }
};

const toAddressResult = (roadAddress: KakaoRoadAddress): AddressResult => ({
  roadAddress: roadAddress.address_name,
  buildingName: roadAddress.building_name || undefined,
  city: roadAddress.region_1depth_name,
  district: roadAddress.region_2depth_name,
  eupMyeonDong: roadAddress.region_3depth_name,
});

const loadKakaoMapServices = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('브라우저에서만 위치 주소 변환을 사용할 수 있습니다.'));
  }
  if (window.kakao?.maps?.services) return Promise.resolve();
  if (kakaoMapServicesLoader) return kakaoMapServicesLoader;

  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;
  if (!appKey) {
    return Promise.reject(new Error('VITE_KAKAO_MAP_KEY 가 설정되지 않았습니다.'));
  }

  kakaoMapServicesLoader = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${encodeURIComponent(appKey)}&libraries=services`;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'));
        return;
      }

      window.kakao.maps.load(() => {
        if (window.kakao?.maps?.services) resolve();
        else reject(new Error('카카오 지도 주소 변환 서비스를 불러오지 못했습니다.'));
      });
    };
    script.onerror = () => reject(new Error('카카오 지도 SDK 요청에 실패했습니다.'));
    document.head.appendChild(script);
  });

  return kakaoMapServicesLoader;
};

const reverseGeocodeWithMapSdk = async (latitude: number, longitude: number): Promise<AddressResult> => {
  await loadKakaoMapServices();

  return new Promise<AddressResult>((resolve, reject) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(longitude, latitude, (result, status) => {
      const roadAddress = status === window.kakao.maps.services.Status.OK ? result[0]?.road_address : null;
      if (!roadAddress) {
        reject(new Error('현재 위치의 도로명 주소를 찾을 수 없습니다.'));
        return;
      }

      resolve(
        toAddressResult({
          address_name: roadAddress.address_name,
          building_name: roadAddress.building_name,
          region_1depth_name: roadAddress.region_1depth_name,
          region_2depth_name: roadAddress.region_2depth_name,
          region_3depth_name: roadAddress.region_3depth_name,
        })
      );
    });
  });
};
