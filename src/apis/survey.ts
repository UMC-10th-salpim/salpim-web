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
    { value: 'cost', label: '병원비가 부답돼요'},
    { value: 'checkup', label: '건강검진을 받고 싶어요'},
    { value: 'mental', label: '치매나 정신 건강이 걱정돼요'},
    { value: 'rehab', label: '요양이나 재활 도움이 필요해요'},
    { value: 'device', label: '보청기나 보조기기가 필요해요'},
  ],
 },
 
 living : {
  id : 'living_detail',
  question : '생활비 부담이 있어요',
  options : [
    { value: 'montly', label: '매달 생활비가 부족해요'},
    { value: 'telecom', label: '통신비를 줄이고 싶어요'},
    { value: 'utility', label: '난방비나 전기요금이 부담돼요'},
    { value: 'food', label: '식비 지원이 필요해요'},
    { value: 'emergency', label: '갑자기 돈이 필요해요'},
  ],
 },

 housing : {
  id : 'housing_detail',
  question : '집이나 공과금 지원이 필요해요',
  options : [
    { value: 'rent' , label : '월세나 주거비가 부담돼요'},
    { value: 'repair' , label : '집수리나 환경 개선이 필요해요'},
    { value: 'utility' , label : '전기·가스·난방비가 부담돼요'},
    { value: 'shelter' , label : '당장 머물 곳이 필요해요'},
    { value: 'affordable_housing' , label : '저렴하게 살 수 있는 집 정보를 알고 싶어요'},
  ],
 },

 care : {
  id : 'care_detail',
  question : '생활 도움이나 돌봄이 필요해요',
  options : [
    { value : 'housekeeping' , label : '식사나 청소 도움이 필요해요'},
    { value : 'loneliness' , label : '혼자 지내는 게 걱정돼요'},
    { value : 'mobility' , label : '이동이나 외출할 때 도움이 필요해요'},
    { value : 'homecare' , label : '집에 와서 도와줄 사람이 필요해요'},
    { value : 'emergency_care' , label : '위급할 때 도움 받고 싶어요'},
  ],
 },

 culture : {
  id : 'culture_detail',
  question : '문화·배움 활동을 하고 싶어요',
  options : [
    { value: 'hobby', label : '취미나 여가 활동을 하고 싶어요'},
    { value: 'learning', label : '새로운 공부를 하고 싶어요'},
    { value: 'digital', label : '스마트폰이나 디지털 기기를 배우고 싶어요'},
    { value: 'exercise', label : '운동이나 건강 관리를 하고 싶어요'},
    { value: 'culture_benefit', label : '문화생활 헤택을 받고 싶어요'},
  ],
 },

 job : {
  id : 'job_detail',
  question : '일자리를 찾고 있어요',
  options : [
    { value : 'senior_job', label : '노인 일자리에 참여하고 싶어요'},
    { value : 'job_counseling', label : '취업 상담을 받고 싶어요'},
    { value : 'job_training', label : '직업교육이나 훈련을 받고 싶어요'},
  ]
 }
}