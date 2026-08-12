// 카카오 로컬 - 키워드로 장소 검색 API (주변 시설 검색용)
// 문서: https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword
// 참고: 로컬 검색용 REST 키는 프론트 노출이 일반적으로 허용되나, 운영에서는 백엔드 프록시 권장.
import client from './client';
import { FACILITY_CATEGORY_GROUPS } from '@/features/map/types';
import type { Facility, FacilityMainCategory, MapCenter } from '@/features/map/types';

const KAKAO_LOCAL_KEYWORD_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json';
const SEARCH_RADIUS_METERS = 3000;
const RESULTS_PER_SUBCATEGORY = 5;

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface FacilityBenefit {
  benefitId: number;
  servId: string;
  region: string;
  serviceName: string;
}

export interface FacilityBenefitPage {
  data: FacilityBenefit[];
  hasNext: boolean;
  nextCursor: string | null;
  pageSize: number;
  totalCount: number;
}

export interface FacilityDetails {
  name: string;
  address: string;
  hour: string | null;
  distanceText: string;
  isMyCenter: boolean;
  benefits: FacilityBenefitPage;
}

export interface FacilityDetailsParams {
  facilityName: string;
  address: string;
  latitude: number;
  longitude: number;
  cursor?: string;
  size?: number;
}

export const getFacilityDetails = async ({
  facilityName,
  address,
  latitude,
  longitude,
  cursor,
  size = 10,
}: FacilityDetailsParams): Promise<FacilityDetails> => {
  const { data } = await client.get<ApiResponse<FacilityDetails>>('/map/details', {
    params: {
      facilityName,
      address,
      latitude,
      longitude,
      ...(cursor ? { cursor } : {}),
      size,
    },
  });

  return data.result;
};

// 카카오 로컬 검색에서 실제로 더 잘 매칭되는 키워드로 보정
const SUBCATEGORY_SEARCH_KEYWORD: Record<string, string> = {
  보건소: '보건소',
  병원: '병원',
  약국: '약국',
  치매센터: '치매안심센터',
  주민센터: '행정복지센터',
  복지관: '노인복지관',
  무료급식: '무료급식소',
  생활지원센터: '생활지원센터',
  요양시설: '요양시설',
  돌봄시설: '노인돌봄센터',
  도서관: '도서관',
  문화센터: '문화센터',
  체육관: '체육관',
  평생교육원: '평생교육원',
  '노인 일자리기관': '노인일자리기관',
  '디지털 배움터': '디지털배움터',
  시니어클럽: '시니어클럽',
};

interface KakaoKeywordDoc {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string; // 경도(lng)
  y: string; // 위도(lat)
  distance: string; // 반경 검색 시 미터 단위 문자열
}

interface KakaoKeywordResponse {
  documents: KakaoKeywordDoc[];
}

const formatDistance = (meters: string): string => {
  const value = Number(meters) || 0;
  return value >= 1000 ? `${(value / 1000).toFixed(1)}km` : `${value}m`;
};

// "CU 구로보건소점" 처럼 편의점 지점명이 검색 키워드와 우연히 겹쳐 나오는 경우를 걸러낸다.
const EXCLUDED_NAME_PREFIXES = ['CU', 'GS25', 'GS', '파리바게뜨', '이마트24'];

const isExcludedFacilityName = (name: string) =>
  EXCLUDED_NAME_PREFIXES.some((prefix) => name.trim().toUpperCase().startsWith(prefix));

const normalizeFacilityName = (name: string) =>
  name.toLowerCase().replace(/[^0-9a-z가-힣]/g, '');

const getAdministrativeAreaStem = (name: string) =>
  normalizeFacilityName(name)
    .replace(/행정복지센터|주민센터|복지관/g, '')
    .replace(/[동읍면]$/, '');

export const isFacilityNameMatch = (candidateName: string, targetName: string) => {
  const candidate = normalizeFacilityName(candidateName);
  const target = normalizeFacilityName(targetName);
  if (!candidate || !target) return false;

  if (candidate === target || candidate.includes(target) || target.includes(candidate)) return true;

  const candidateStem = getAdministrativeAreaStem(candidateName);
  const targetStem = getAdministrativeAreaStem(targetName);
  return (
    Boolean(candidateStem && targetStem) &&
    (candidateStem === targetStem ||
      candidateStem.startsWith(targetStem) ||
      targetStem.startsWith(candidateStem))
  );
};

const getWelfareFacilitySubCategory = (name: string) => {
  if (/주민센터|행정복지센터/.test(name)) return '주민센터';
  return '복지관';
};

// 홈의 "내 근처 혜택 시설"에서 전달받은 기관명을 실제 카카오 장소 좌표로 변환한다.
export const searchFacilityByName = async (
  facilityName: string,
  center: MapCenter
): Promise<Facility | null> => {
  const key = import.meta.env.VITE_KAKAO_REST_API_KEY?.trim();
  const query = facilityName.trim();
  if (!key || !query) return null;

  const hasFacilityType = /복지관|주민센터|행정복지센터|센터|보건소|병원|약국/.test(query);
  // 현재 백엔드의 welfareCenter에는 기관명 대신 행정동명이 저장될 수 있다.
  // 이 경우 해당 동의 행정복지센터를 우선 검색한다.
  const administrativeStem = getAdministrativeAreaStem(query);
  const searchQueries = Array.from(
    new Set(
      hasFacilityType
        ? [query]
        : [
            `${query} 행정복지센터`,
            administrativeStem ? `${administrativeStem} 행정복지센터` : '',
            '행정복지센터',
          ].filter(Boolean)
    )
  );

  const searchResults = await Promise.allSettled(
    searchQueries.map(async (searchQuery) => {
      const params = new URLSearchParams({
        query: searchQuery,
        x: String(center.lng),
        y: String(center.lat),
        radius: '20000',
        sort: 'distance',
        size: '15',
      });

      const response = await fetch(`${KAKAO_LOCAL_KEYWORD_URL}?${params.toString()}`, {
        headers: { Authorization: `KakaoAK ${key}` },
      });
      if (!response.ok) throw new Error(`기관 위치 검색 실패 (${response.status})`);

      const data: KakaoKeywordResponse = await response.json();
      return data.documents;
    })
  );

  const documents = Array.from(
    new Map(
      searchResults.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])).map(
        (document) => [document.id, document]
      )
    ).values()
  );
  const matched = documents.find(
    (document) =>
      !isExcludedFacilityName(document.place_name) &&
      isFacilityNameMatch(document.place_name, query)
  );

  if (!matched || isExcludedFacilityName(matched.place_name)) return null;

  const subCategory = getWelfareFacilitySubCategory(matched.place_name);
  return {
    id: matched.id,
    name: matched.place_name,
    mainCategory: '생활지원',
    subCategory,
    address: matched.road_address_name || matched.address_name,
    lat: Number(matched.y),
    lng: Number(matched.x),
    distanceFromHome: formatDistance(matched.distance),
    phone: matched.phone || undefined,
  };
};

const searchFacilitiesBySubCategory = async (
  mainCategory: FacilityMainCategory,
  subCategory: string,
  center: MapCenter,
  key: string
): Promise<Facility[]> => {
  const params = new URLSearchParams({
    query: SUBCATEGORY_SEARCH_KEYWORD[subCategory] ?? subCategory,
    x: String(center.lng),
    y: String(center.lat),
    radius: String(SEARCH_RADIUS_METERS),
    sort: 'distance',
    size: String(RESULTS_PER_SUBCATEGORY),
  });

  const res = await fetch(`${KAKAO_LOCAL_KEYWORD_URL}?${params.toString()}`, {
    headers: { Authorization: `KakaoAK ${key}` },
  });
  if (!res.ok) throw new Error(`시설 검색 실패 (${subCategory}, ${res.status})`);

  const data: KakaoKeywordResponse = await res.json();

  return data.documents
    .filter((doc) => !isExcludedFacilityName(doc.place_name))
    .map((doc) => ({
      id: doc.id,
      name: doc.place_name,
      mainCategory,
      subCategory,
      address: doc.road_address_name || doc.address_name,
      lat: Number(doc.y),
      lng: Number(doc.x),
      distanceFromHome: formatDistance(doc.distance),
      phone: doc.phone || undefined,
    }));
};

// 회원이 등록한 집 주변의 실제 시설을 카테고리별로 모두 검색한다.
// REST 키가 없거나 일부 카테고리 검색이 실패해도 나머지 결과는 반환한다.
export const searchAllFacilities = async (center: MapCenter): Promise<Facility[]> => {
  const key = import.meta.env.VITE_KAKAO_REST_API_KEY;

  if (!key) {
    if (import.meta.env.DEV) {
      console.warn('[facility] VITE_KAKAO_REST_API_KEY 없음 → 목데이터로 대체됩니다.');
    }
    return [];
  }

  const tasks = FACILITY_CATEGORY_GROUPS.flatMap((group) =>
    group.options.map((subCategory) =>
      searchFacilitiesBySubCategory(group.main, subCategory, center, key)
    )
  );

  const settled = await Promise.allSettled(tasks);

  const results = settled.flatMap((result) => {
    if (result.status === 'rejected') {
      if (import.meta.env.DEV) {
        console.warn('[facility] 일부 카테고리 검색 실패', result.reason);
      }
      return [];
    }
    return result.value;
  });

  // 같은 카카오 장소가 여러 검색어에 잡혀도 지도에는 한 번만 표시한다.
  return Array.from(new Map(results.map((facility) => [facility.id, facility])).values());
};
