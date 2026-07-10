export type FacilityMainCategory = '건강·의료' | '생활지원' | '문화' | '배움·일자리';

export interface FacilityCategoryGroup {
  main: FacilityMainCategory;
  options: string[];
}

export const FACILITY_CATEGORY_GROUPS: FacilityCategoryGroup[] = [
  { main: '건강·의료', options: ['보건소', '병원', '약국', '치매 센터'] },
  { main: '생활지원', options: ['주민센터', '복지관', '동행센터'] },
  { main: '문화', options: ['경로당', '문화센터'] },
  { main: '배움·일자리', options: ['평생교육원', '일자리센터'] },
];

export const FACILITY_MAIN_CATEGORIES: FacilityMainCategory[] = FACILITY_CATEGORY_GROUPS.map(
  (group) => group.main
);

export interface MarkerPosition {
  left: number;
  top: number;
}

export interface Facility {
  id: string;
  name: string;
  mainCategory: FacilityMainCategory;
  subCategory: string;
  address: string;
  detailAddress?: string;
  lat: number;
  lng: number;
  markerPosition: MarkerPosition;
  distanceFromHome: string;
  phone?: string;
  operatingHours: string;
}
