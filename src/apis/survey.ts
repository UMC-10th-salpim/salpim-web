import client from "./client";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message : string;
  result : T;
}

export interface RecommendationOption {
  optionId: number;
  optionOrder : number;
  optionText : string;
}

interface RecommendationOptionsResult {
  recommendationOptionDTOList : RecommendationOption[];
}

export const surveyApi = {
  getSecondQuestionOptions : async (categoryId : number) => {
    const {data} = await client.get<ApiResponse<RecommendationOptionsResult>>(
      `/recommendations/options/${categoryId}`
    );
    return data.result.recommendationOptionDTOList;
  },
};

export interface QuestionOption {
  value: number;
  label: string;
  icon?: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  multiple?: boolean;
}

export type SurveyAnswers = Record<string, number | number[]>;

//TODO : optionId는 피그마 기준으로 임시값입니다. 백엔드 확인 후 필요 시 값 교체 예정
export const SECOND_QUESTIONS : Record<number, SurveyQuestion> = {
 1 : {
  id : 'medical_detail',
  question: '건강·병원비가 걱정돼요',
  options : [
    { value: 1, label: '병원비'},
    { value: 2, label: '건강검진'},
    { value: 3, label: '치매나 정신 건강'},
    { value: 4, label: '요양이나 재활 도움'},
    { value: 5, label: '보청기나 보조기기'},
  ],
 },
 
 2 : {
  id : 'living_detail',
  question : '생활비 부담이 있어요',
  options : [
    { value: 1, label: '생활비'},
    { value: 2, label: '통신비'},
    { value: 3, label: '난방비나 전기요금'},
    { value: 4, label: '식비 지원'},
    { value: 5, label: '급한 돈 필요'},
  ],
 },

 4 : {
  id : 'housing_detail',
  question : '집이나 공과금 지원이 필요해요',
  options : [
    { value: 1 , label : '월세나 주거비'},
    { value: 2 , label : '집수리나 환경 개선'},
    { value: 3 , label : '전기·가스·난방비가 부담'},
    { value: 4 , label : '잠시 머물곳 지원'},
    { value: 5 , label : '저렴한 집 정보'},
  ],
 },

 3 : {
  id : 'care_detail',
  question : '생활 도움이나 돌봄이 필요해요',
  options : [
    { value : 1 , label : '식사나 청소'},
    { value : 2 , label : '혼자 생활'},
    { value : 3 , label : '이동이나 외출'},
    { value : 4 , label : '방문 돌봄'},
    { value : 5 , label : '응급 상황 도움'},
  ],
 },

 6 : {
  id : 'culture_detail',
  question : '문화·배움 활동을 하고 싶어요',
  options : [
    { value: 1, label : '취미나 여가 활동'},
    { value: 2, label : '새로운 공부'},
    { value: 3, label : '스마트폰이나 디지털 기기 교육'},
    { value: 4, label : '운동이나 건강 관리'},
    { value: 5, label : '문화생활'},
  ],
 },

 5 : {
  id : 'job_detail',
  question : '일자리를 찾고 있어요',
  options : [
    { value : 1, label : '노인 일자리 참여'},
    { value : 2, label : '취업 상담'},
    { value : 3, label : '직업교육이나 훈련'},
  ]
 }
}