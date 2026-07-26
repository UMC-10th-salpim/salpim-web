// TODO: 설문 관련 API 함수 구현
export const surveyApi = {};

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  multiple?: boolean;
}

export type SurveyAnswers = Record<string, string | string[]>;

export const SECOND_QUESTIONS : Record<string, SurveyQuestion> = {
 medical : {
  id : 'medical_detail',
  question: '건강·병원비가 걱정돼요',
  options : [
    { value: 'cost', label: '병원비'},
    { value: 'checkup', label: '건강검진'},
    { value: 'mental', label: '치매나 정신 건강'},
    { value: 'rehab', label: '요양이나 재활 도움'},
    { value: 'device', label: '보청기나 보조기기'},
  ],
 },
 
 living : {
  id : 'living_detail',
  question : '생활비 부담이 있어요',
  options : [
    { value: 'montly', label: '생활비'},
    { value: 'telecom', label: '통신비'},
    { value: 'utility', label: '난방비나 전기요금'},
    { value: 'food', label: '식비 지원'},
    { value: 'emergency', label: '급한 돈 필요'},
  ],
 },

 housing : {
  id : 'housing_detail',
  question : '집이나 공과금 지원이 필요해요',
  options : [
    { value: 'rent' , label : '월세나 주거비'},
    { value: 'repair' , label : '집수리나 환경 개선'},
    { value: 'utility' , label : '전기·가스·난방비가 부담'},
    { value: 'shelter' , label : '잠시 머물곳 지원'},
    { value: 'affordable_housing' , label : '저렴한 집 정보'},
  ],
 },

 care : {
  id : 'care_detail',
  question : '생활 도움이나 돌봄이 필요해요',
  options : [
    { value : 'housekeeping' , label : '식사나 청소'},
    { value : 'loneliness' , label : '혼자 생활'},
    { value : 'mobility' , label : '이동이나 외출'},
    { value : 'homecare' , label : '방문 돌봄'},
    { value : 'emergency_care' , label : '응급 상황 도움'},
  ],
 },

 culture : {
  id : 'culture_detail',
  question : '문화·배움 활동을 하고 싶어요',
  options : [
    { value: 'hobby', label : '취미나 여가 활동'},
    { value: 'learning', label : '새로운 공부'},
    { value: 'digital', label : '스마트폰이나 디지털 기기 교육'},
    { value: 'exercise', label : '운동이나 건강 관리'},
    { value: 'culture_benefit', label : '문화생활'},
  ],
 },

 job : {
  id : 'job_detail',
  question : '일자리를 찾고 있어요',
  options : [
    { value : 'senior_job', label : '노인 일자리 참여'},
    { value : 'job_counseling', label : '취업 상담'},
    { value : 'job_training', label : '직업교육이나 훈련'},
  ]
 }
}