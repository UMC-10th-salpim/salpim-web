// 카카오 로컬 - 주소 검색 API (도로명/지번)
// 문서: https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-address
// 참고: 로컬 검색용 REST 키는 프론트 노출이 일반적으로 허용되나, 운영에서는 백엔드 프록시 권장.

const KAKAO_LOCAL_URL = 'https://dapi.kakao.com/v2/local/search/address.json';
const KAKAO_COORD_TO_ADDRESS_URL = 'https://dapi.kakao.com/v2/local/geo/coord2address.json';
const PAGE_SIZE = 10;
const LOCATION_COORDINATE_PRECISION = 7;

const SIDO_FULL_NAMES: Record<string, string> = {
  서울: '서울특별시',
  서울시: '서울특별시',
  부산: '부산광역시',
  부산시: '부산광역시',
  대구: '대구광역시',
  대구시: '대구광역시',
  인천: '인천광역시',
  인천시: '인천광역시',
  광주: '광주광역시',
  광주시: '광주광역시',
  대전: '대전광역시',
  대전시: '대전광역시',
  울산: '울산광역시',
  울산시: '울산광역시',
  세종: '세종특별자치시',
  세종시: '세종특별자치시',
  경기: '경기도',
  강원: '강원특별자치도',
  강원도: '강원특별자치도',
  충북: '충청북도',
  충남: '충청남도',
  전북: '전북특별자치도',
  전라북도: '전북특별자치도',
  전남: '전라남도',
  경북: '경상북도',
  경남: '경상남도',
  제주: '제주특별자치도',
  제주도: '제주특별자치도',
};

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

export interface RegionResolvePayload {
  sido: string;
  sigungu: string;
  generalGu: string;
  administrativeArea: string;
}

export interface NormalizedLocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface AddressSearchResponse {
  results: AddressResult[];
  /** 마지막 페이지 여부 → 더보기 노출 판단 */
  isEnd: boolean;
  /** 전체 검색 결과 수 */
  totalCount: number;
}

interface KakaoRegionAddress {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_3depth_h_name?: string;
}

interface KakaoRoadAddress extends KakaoRegionAddress {
  building_name: string;
}

type KakaoJibunAddress = KakaoRegionAddress;

interface KakaoDoc {
  address_name: string;
  road_address: KakaoRoadAddress | null;
  address: KakaoJibunAddress | null;
}

interface KakaoResponse {
  documents: KakaoDoc[];
  meta: { is_end: boolean; total_count: number };
}

interface KakaoCoordinateResponse {
  documents: Array<{
    road_address: KakaoRoadAddress | null;
    address: KakaoJibunAddress | null;
  }>;
  meta: { total_count: number };
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
    return {
      roadAddress: doc.road_address?.address_name || doc.address_name,
      buildingName: doc.road_address?.building_name || undefined,
      city: firstNonEmpty(doc.address?.region_1depth_name, doc.road_address?.region_1depth_name),
      district: firstNonEmpty(
        doc.address?.region_2depth_name,
        doc.road_address?.region_2depth_name
      ),
      eupMyeonDong: firstNonEmpty(
        doc.address?.region_3depth_h_name,
        doc.address?.region_3depth_name,
        doc.road_address?.region_3depth_name
      ),
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

      const data: KakaoCoordinateResponse = await res.json();
      const document = data.documents[0];
      const roadAddress = document?.road_address;
      if (roadAddress) return toAddressResult(roadAddress, document.address);

      const jibunAddress = document?.address;
      if (jibunAddress) return toJibunAddressResult(jibunAddress);

      throw new Error('현재 위치의 주소를 찾을 수 없습니다.');
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

const firstNonEmpty = (...values: Array<string | null | undefined>): string =>
  values.find((value) => value?.trim())?.trim() ?? '';

/** 현재 위치와 직접 검색 모두 공식 시·도 전체 명칭으로 저장한다. */
export const normalizeRoadAddress = (roadAddress: string): string => {
  const normalized = roadAddress.replace(/\s+/g, ' ').trim();
  const [sido = '', ...rest] = normalized.split(' ');
  return [SIDO_FULL_NAMES[sido] ?? sido, ...rest].filter(Boolean).join(' ');
};

const toAddressResult = (
  roadAddress: KakaoRoadAddress,
  jibunAddress?: KakaoJibunAddress | null
): AddressResult => ({
  roadAddress: roadAddress.address_name,
  buildingName: roadAddress.building_name || undefined,
  city: firstNonEmpty(jibunAddress?.region_1depth_name, roadAddress.region_1depth_name),
  district: firstNonEmpty(jibunAddress?.region_2depth_name, roadAddress.region_2depth_name),
  eupMyeonDong: firstNonEmpty(
    jibunAddress?.region_3depth_h_name,
    jibunAddress?.region_3depth_name,
    roadAddress.region_3depth_name
  ),
});

const toJibunAddressResult = (jibunAddress: KakaoJibunAddress): AddressResult => ({
  roadAddress: jibunAddress.address_name,
  city: jibunAddress.region_1depth_name,
  district: jibunAddress.region_2depth_name,
  eupMyeonDong: firstNonEmpty(
    jibunAddress.region_3depth_h_name,
    jibunAddress.region_3depth_name
  ),
});

const hasCompleteRegion = (address: AddressResult) =>
  Boolean(address.city.trim() && address.eupMyeonDong.trim());

/**
 * 카카오의 2단계 지역명(예: "고양시 덕양구")을 백엔드의
 * 시/군/구와 일반구 필드로 분리한다. 광역시의 자치구처럼 한 단계인
 * 지역(예: "미추홀구")은 sigungu에만 담는다.
 */
export const toRegionResolvePayload = (address: AddressResult): RegionResolvePayload => {
  const [sigungu = '', ...generalGuParts] = address.district.trim().split(/\s+/).filter(Boolean);
  const sido = address.city.trim();
  const payload = {
    // 카카오 응답이 "인천", "서울"처럼 축약되어도 백엔드에는
    // "인천광역시", "서울특별시"와 같은 공식 시·도명을 전달한다.
    sido: SIDO_FULL_NAMES[sido] ?? sido,
    sigungu,
    generalGu: generalGuParts.join(' '),
    administrativeArea: address.eupMyeonDong.trim(),
  };

  if (!payload.sido || !payload.administrativeArea) {
    throw new Error('선택한 주소의 행정구역 정보를 확인하지 못했습니다.');
  }

  return payload;
};

/**
 * 이전 검색 결과나 일부 도로명 주소 응답에 읍·면·동이 빠져 있어도
 * 회원가입 직전에 주소를 다시 조회해 백엔드 필수 지역값을 완성한다.
 */
export const ensureAddressRegion = async (address: AddressResult): Promise<AddressResult> => {
  let completedResult: AddressResult | undefined;

  try {
    // 역지오코딩은 법정동(region_3depth_name)만 주는 경우가 있어
    // 도로명 주소를 다시 조회하고 행정동(region_3depth_h_name)을 우선 사용한다.
    const response = await searchAddress(address.roadAddress, 1);
    const normalizedRoadAddress = normalizeRoadAddress(address.roadAddress);
    const exactResult = response.results.find(
      (result) => normalizeRoadAddress(result.roadAddress) === normalizedRoadAddress
    );
    completedResult =
      (exactResult && hasCompleteRegion(exactResult) ? exactResult : undefined) ??
      response.results.find(hasCompleteRegion);
  } catch (error) {
    if (!hasCompleteRegion(address)) throw error;
  }

  if (!completedResult && !hasCompleteRegion(address)) {
    throw new Error('선택한 주소의 읍·면·동 정보를 확인하지 못했습니다.');
  }

  return {
    ...address,
    roadAddress: normalizeRoadAddress(address.roadAddress),
    city: firstNonEmpty(completedResult?.city, address.city),
    district: firstNonEmpty(completedResult?.district, address.district),
    // 재조회 결과의 행정동을 기존 역지오코딩의 법정동보다 우선한다.
    eupMyeonDong: firstNonEmpty(completedResult?.eupMyeonDong, address.eupMyeonDong),
  };
};

/**
 * 회원가입과 개인정보 수정에서 백엔드로 전달하는 좌표 형식을 통일한다.
 * 위치 API가 반환하는 긴 소수 값은 백엔드 숫자 필드의 허용 자릿수를
 * 초과할 수 있으므로 WGS84 좌표를 검증한 뒤 소수점 7자리로 제한한다.
 */
export const normalizeLocationCoordinates = (
  latitude: number,
  longitude: number
): NormalizedLocationCoordinates => {
  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error('위치 좌표가 올바르지 않습니다.');
  }

  return {
    latitude: Number(latitude.toFixed(LOCATION_COORDINATE_PRECISION)),
    longitude: Number(longitude.toFixed(LOCATION_COORDINATE_PRECISION)),
  };
};

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
      const jibunRegion = status === window.kakao.maps.services.Status.OK ? result[0]?.address : null;
      if (roadAddress) {
        resolve(
          toAddressResult(
            {
              address_name: roadAddress.address_name,
              building_name: roadAddress.building_name,
              region_1depth_name: roadAddress.region_1depth_name,
              region_2depth_name: roadAddress.region_2depth_name,
              region_3depth_name: roadAddress.region_3depth_name,
            },
            jibunRegion
          )
        );
        return;
      }

      const jibunAddressName = jibunRegion?.address_name;
      if (!jibunAddressName) {
        reject(new Error('현재 위치의 주소를 찾을 수 없습니다.'));
        return;
      }

      const jibunAddress: KakaoJibunAddress = {
        address_name: jibunAddressName,
        region_1depth_name: jibunRegion.region_1depth_name,
        region_2depth_name: jibunRegion.region_2depth_name,
        region_3depth_name: jibunRegion.region_3depth_name,
        region_3depth_h_name: jibunRegion.region_3depth_h_name,
      };

      // 좌표 응답에 도로명 주소가 없을 때만 지번 주소를 최종 주소로 사용한다.
      resolve(toJibunAddressResult(jibunAddress));
    });
  });
};
