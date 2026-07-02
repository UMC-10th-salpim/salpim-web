export type FacilityCategory = '복지관' | '주민센터' | '보건소' | '병원' | '약국' | '기타';

export interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  address: string;
  lat?: number;
  lng?: number;
  distance?: string;
  phone?: string;
  operatingHours?: string;
  description?: string;
  services?: string[];
  tags?: string[];
}

export const FACILITY_CATEGORIES: FacilityCategory[] = [
  '복지관',
  '주민센터',
  '보건소',
  '병원',
  '약국',
  '기타',
];
