import { NextResponse } from "next/server"; // Next.js 13에서 API 라우트에서 JSON 응답을 반환할 때 사용합니다.
import { buildRecommendedCourses } from "@/lib/recommendation/build-course";// 추천 코스를 생성하는 로직을 별도의 모듈로 분리하여 가져옵니다.
import type{
  AgeGroup,
  PartyType,
  PetType,
  RegionId,
  SurveyResponse,
  TransportType,
} from "@/types/survey"; // 설문 응답 타입 정의를 가져옵니다.

const REGION_IDS = [
  "gangneung",
  "sokcho",
  "yangyang",
  "donghae",
  "samcheok",
] satisfies RegionId[];
const PARTY_TYPES = ["solo", "couple", "family", "group"] satisfies PartyType[];
const TRANSPORT_TYPES = ["car", "public", "rental"] satisfies TransportType[];
const PET_TYPES = ["none", "small", "large"] satisfies PetType[];
const AGE_GROUPS = [
  "teens-twenties",
  "thirties",
  "forties",
  "fifties-plus",
] satisfies AgeGroup[];


// SurveyResponse 타입인지 확인하는 타입 가드 함수입니다.
// 예: value가 "yangyang"이고 REGION_IDS 안에 있으면 true를 반환합니다.
function isStringIncluded<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return typeof value === "string" && values.includes(value as T);
}


//요청 body가 SurveyResponse 타입인지 확인하는 타입 가드 함수입니다. 확인값이 5개인지 확인. 
function isSurveyResponse(value: unknown): value is SurveyResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    isStringIncluded(REGION_IDS, body.regionId) &&
    isStringIncluded(PARTY_TYPES, body.partyType) &&
    isStringIncluded(TRANSPORT_TYPES, body.transportType) &&
    isStringIncluded(PET_TYPES, body.petType) &&
    isStringIncluded(AGE_GROUPS, body.ageGroup)
  );
}


// POST /api/course/recommend 로 요청을 보내면 Next.js가 이 함수를 실행합니다.
// 설문 응답을 받아 추천 코스 배열을 JSON으로 반환합니다.
export async function POST(request: Request) {
  try {
    // 클라이언트가 보낸 JSON body를 읽습니다.
    const body = await request.json();

    // body가 SurveyResponse 형식이 아니면 안전하게 빈 courses를 반환합니다.
    if (!isSurveyResponse(body)) {
      return NextResponse.json({ courses: [] }, { status: 400 });
    }

    // 검증된 설문 응답을 추천 로직에 넘겨 코스를 생성합니다.
    const courses = buildRecommendedCourses(body);

    // 정상 응답도 항상 { courses: Course[] } 형태로 반환합니다.
    return NextResponse.json({ courses });
  } catch {
    // JSON 파싱 실패나 예상하지 못한 예외가 발생해도 서버가 터지지 않도록 처리합니다.
    return NextResponse.json({ courses: [] }, { status: 500 });
  }
}