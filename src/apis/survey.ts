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

export const SECOND_QUESTIONS: Record<number, { id: string; question: string }> = {
  1: { id: 'medical_detail', question: '건강·병원비가 걱정돼요' },
  2: { id: 'living_detail', question: '생활비 부담이 있어요' },
  3: { id: 'housing_detail', question: '집이나 공과금 지원이 필요해요' },
  4: { id: 'care_detail', question: '생활 도움이나 돌봄이 필요해요' },
  5: { id: 'culture_detail', question: '문화·배움 활동을 하고 싶어요' },
  6: { id: 'job_detail', question: '일자리를 찾고 있어요' },
};