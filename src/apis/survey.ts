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
  1: { id: 'medical_detail', question: '어떤 의료 지원이 필요하세요?' },
  2: { id: 'living_detail', question: '어떤 생활비 지원이 필요하세요?' },
  3: { id: 'housing_detail', question: '어떤 주거 지원이 필요하세요?' },
  4: { id: 'care_detail', question: '어떤 돌봄 지원이 필요하세요?' },
  5: { id: 'culture_detail', question: '어떤 문화 활동 지원이 필요하세요?' },
  6: { id: 'job_detail', question: '어떤 일자리 지원이 필요하세요?' },
};