import client from './client';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface Region {
  regionId: number;
  regionName: string;
}

interface RegionListResult {
  regionList: Region[];
}

export const regionApi = {
  getRegions: async (): Promise<Region[]> => {
    const { data } = await client.get<ApiResponse<RegionListResult>>('/regions');
    return data.result.regionList;
  },

  getChildRegions: async (ancestorRegionId: number): Promise<Region[]> => {
    const { data } = await client.get<ApiResponse<RegionListResult>>(
      `/regions/${ancestorRegionId}/children`
    );
    return data.result.regionList;
  },
};