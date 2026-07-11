import type { Place } from "@/types/place";
import type { SurveyResponse } from "@/types/survey";
import { getPreferredTags } from "./tags";

// 장소 하나가 설문 조건과 얼마나 잘 맞는지 점수로 계산합니다.
// 점수가 높을수록 추천 코스에 먼저 들어갈 가능성이 커집니다.
export function scorePlace(place: Place, survey: SurveyResponse): number {
  const preferredTags = getPreferredTags(survey);
  let score = 0;

  // 설문 조건에서 나온 선호 태그와 장소 태그가 일치하면 점수를 더합니다.
  // 예: 선호 태그 "#오션뷰"가 장소 태그에도 있으면 +10점
  for (const tag of preferredTags) {
    if (place.tags.includes(tag)) {
      score += 10;
    }
  }

  // 반려동물 동반 조건이 있는 경우 펫프렌들리 장소를 우선합니다.
  // small 또는 large를 선택했는데 장소가 pet-friendly면 +30점입니다.
  if (survey.petType !== "none" && place.isPetFriendly) {
    score += 30;
  }

  // 반대로 반려동물 동반 조건이 있는데 펫프렌들리가 아니면 감점합니다.
  if (survey.petType !== "none" && !place.isPetFriendly) {
    score -= 20;
  }

  // 대중교통 이용자는 접근성이 좋은 장소를 우선합니다.
  if (survey.transportType === "public" && place.tags.includes("#접근성")) {
    score += 15;
  }

  // 자차 또는 렌터카 이용자는 주차가 가능한 장소를 우선합니다.
  if (
    (survey.transportType === "car" || survey.transportType === "rental") &&
    place.tags.includes("#주차")
  ) {
    score += 10;
  }

  return score;
}