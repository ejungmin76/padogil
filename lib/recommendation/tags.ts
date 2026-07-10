import type { SurveyResponse } from "@/types/survey";// 설문 응답 타입 정의를 가져옵니다.

// 설문 응답을 추천 태그 목록으로 변환.
// 이 태그들은 장소 점수 계산과 코스 카드의 해시태그 표시에서 함께 사용됩니다.
export function getPreferredTags(survey: SurveyResponse): string[] {
  const tags: string[] = [];

  // 권역별 대표 태그입니다.
  // 사용자가 선택한 지역의 성격을 추천에 반영하기 위해 사용합니다.
  const regionTags: Record<SurveyResponse["regionId"], string[]> = {
    gangneung: ["#커피", "#오션뷰", "#문화"],
    "goseong-sokcho": ["#자연", "#가족여행", "#역사"],
    yangyang: ["#서핑", "#액티비티", "#청년여행"],
    donghae: ["#사진여행", "#로컬", "#산책"],
    samcheok: ["#비경", "#가족여행", "#액티비티"],
  };

  // 동반 인원별 태그입니다.
  // 혼자, 커플, 가족, 단체 여행인지에 따라 선호 장소가 달라질 수 있습니다.
  const partyTags: Record<SurveyResponse["partyType"], string[]> = {
    solo: ["#혼행", "#산책", "#힐링"],
    couple: ["#커플", "#오션뷰", "#카페"],
    family: ["#가족여행", "#체험", "#편안한동선"],
    group: ["#액티비티", "#맛집", "#단체여행"],
  };

  // 이동수단별 태그입니다.
  // 자차/렌터카는 주차와 드라이브, 대중교통은 접근성을 우선합니다.
  const transportTags: Record<SurveyResponse["transportType"], string[]> = {
    car: ["#드라이브", "#주차"],
    public: ["#대중교통", "#접근성"],
    rental: ["#드라이브", "#렌터카", "#주차"],
  };

  // 연령대별 태그입니다.
  // MVP 단계에서는 간단한 가중치 기준으로 사용합니다.
  const ageTags: Record<SurveyResponse["ageGroup"], string[]> = {
    "teens-twenties": ["#핫플", "#액티비티", "#사진여행"],
    thirties: ["#맛집", "#카페", "#힐링"],
    forties: ["#자연", "#문화", "#편안한동선"],
    "fifties-plus": ["#자연", "#산책", "#편안한동선"],
  };

  // 반려동물 동반 조건이 있으면 펫프렌들리 장소가 우선되도록 태그를 추가합니다.
  // petType이 "none"이면 반려동물 관련 태그는 추가하지 않습니다.
  if (survey.petType !== "none") {
    tags.push("#펫프렌들리", "#산책");
  }

  // 설문 조건별 태그들을 하나의 배열로 합칩니다.
  tags.push(
    ...regionTags[survey.regionId],
    ...partyTags[survey.partyType],
    ...transportTags[survey.transportType],
    ...ageTags[survey.ageGroup],
  );

  // 중복 태그를 제거해서 반환합니다.
  // 예: "#액티비티"가 지역 태그와 연령대 태그에 모두 있어도 한 번만 남깁니다.
  return [...new Set(tags)];
}