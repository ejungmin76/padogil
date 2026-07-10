import type { Course } from "@/types/course";
import type { Place } from "@/types/place";
import type { RegionId, SurveyResponse } from "@/types/survey";
import { scorePlace } from "./score";
import { getPreferredTags } from "./tags";

// 더미 장소에도 regionId가 필요합니다.
// 기존 Place 타입에는 regionId가 없기 때문에, 이 파일 안에서만 확장해서 사용합니다.
type SamplePlace = Place & {
  regionId: RegionId;
};

// 관광공사 API 연결 전까지 사용할 임시 장소 데이터입니다.
// 실제 API가 붙으면 이 배열을 API 응답 기반 장소 목록으로 바꾸면 됩니다.
const SAMPLE_PLACES: SamplePlace[] = [
  {
    id: "yangyang-surfyy",
    name: "서피비치",
    regionId: "yangyang",
    category: "leports",
    address: "강원 양양군 현북면 하조대해안길",
    tags: ["#서핑", "#액티비티", "#청년여행", "#핫플", "#주차"],
    isPetFriendly: false,
    source: "sample",
  },
  {
    id: "yangyang-naksansa",
    name: "낙산사",
    regionId: "yangyang",
    category: "tour",
    address: "강원 양양군 강현면 낙산사로",
    tags: ["#문화", "#오션뷰", "#산책", "#자연", "#주차"],
    isPetFriendly: false,
    source: "sample",
  },
  {
    id: "yangyang-hajodae",
    name: "하조대 전망대",
    regionId: "yangyang",
    category: "tour",
    address: "강원 양양군 현북면 하광정리",
    tags: ["#오션뷰", "#사진여행", "#드라이브", "#힐링"],
    isPetFriendly: true,
    source: "sample",
  },
  {
    id: "yangyang-namdaecheon",
    name: "남대천 생태공원",
    regionId: "yangyang",
    category: "tour",
    address: "강원 양양군 양양읍 남대천로",
    tags: ["#펫프렌들리", "#산책", "#가족여행", "#접근성"],
    isPetFriendly: true,
    source: "sample",
  },
  {
    id: "yangyang-local-food",
    name: "양양 로컬 맛집",
    regionId: "yangyang",
    category: "food",
    address: "강원 양양군 양양읍 남문리",
    tags: ["#맛집", "#로컬", "#청년여행", "#주차"],
    isPetFriendly: false,
    source: "sample",
  },

  {
    id: "gangneung-coffee-street",
    name: "안목 커피거리",
    regionId: "gangneung",
    category: "food",
    address: "강원 강릉시 창해로14번길",
    tags: ["#커피", "#카페", "#오션뷰", "#커플", "#접근성"],
    isPetFriendly: true,
    source: "sample",
  },
  {
    id: "gangneung-gyeongpo",
    name: "경포해변",
    regionId: "gangneung",
    category: "tour",
    address: "강원 강릉시 강문동",
    tags: ["#오션뷰", "#산책", "#사진여행", "#주차"],
    isPetFriendly: true,
    source: "sample",
  },
  {
    id: "gangneung-ojuheon",
    name: "오죽헌",
    regionId: "gangneung",
    category: "tour",
    address: "강원 강릉시 율곡로3139번길",
    tags: ["#문화", "#역사", "#가족여행", "#편안한동선"],
    isPetFriendly: false,
    source: "sample",
  },

  {
    id: "sokcho-cheongchoho",
    name: "청초호",
    regionId: "goseong-sokcho",
    category: "tour",
    address: "강원 속초시 청초호반로",
    tags: ["#자연", "#가족여행", "#산책", "#접근성"],
    isPetFriendly: true,
    source: "sample",
  },
  {
    id: "sokcho-market",
    name: "속초관광수산시장",
    regionId: "goseong-sokcho",
    category: "food",
    address: "강원 속초시 중앙로147번길",
    tags: ["#맛집", "#로컬", "#가족여행", "#접근성"],
    isPetFriendly: false,
    source: "sample",
  },
  {
    id: "sokcho-seorak",
    name: "설악산 권역",
    regionId: "goseong-sokcho",
    category: "tour",
    address: "강원 속초시 설악산로",
    tags: ["#자연", "#역사", "#가족여행", "#힐링"],
    isPetFriendly: false,
    source: "sample",
  },

  {
    id: "donghae-mukho",
    name: "묵호항",
    regionId: "donghae",
    category: "tour",
    address: "강원 동해시 일출로",
    tags: ["#로컬", "#사진여행", "#산책", "#맛집"],
    isPetFriendly: true,
    source: "sample",
  },
  {
    id: "donghae-nongoldam",
    name: "논골담길",
    regionId: "donghae",
    category: "tour",
    address: "강원 동해시 논골1길",
    tags: ["#사진여행", "#문화", "#산책", "#로컬"],
    isPetFriendly: false,
    source: "sample",
  },
  {
    id: "donghae-mangsang",
    name: "망상해변",
    regionId: "donghae",
    category: "tour",
    address: "강원 동해시 망상동",
    tags: ["#오션뷰", "#산책", "#드라이브", "#주차"],
    isPetFriendly: true,
    source: "sample",
  },

  {
    id: "samcheok-railbike",
    name: "삼척 해양레일바이크",
    regionId: "samcheok",
    category: "leports",
    address: "강원 삼척시 근덕면 공양왕길",
    tags: ["#액티비티", "#가족여행", "#오션뷰", "#주차"],
    isPetFriendly: false,
    source: "sample",
  },
  {
    id: "samcheok-jangho",
    name: "장호항",
    regionId: "samcheok",
    category: "tour",
    address: "강원 삼척시 근덕면 장호항길",
    tags: ["#비경", "#오션뷰", "#사진여행", "#드라이브"],
    isPetFriendly: true,
    source: "sample",
  },
  {
    id: "samcheok-cave",
    name: "대금굴",
    regionId: "samcheok",
    category: "tour",
    address: "강원 삼척시 신기면 환선로",
    tags: ["#비경", "#자연", "#가족여행", "#체험"],
    isPetFriendly: false,
    source: "sample",
  },
];

// 배열의 특정 위치부터 count개 장소를 뽑습니다.
// 장소 수가 부족하면 처음으로 돌아가서 다시 채워 코스당 3개 이상을 유지합니다.
function pickPlaces(places: SamplePlace[], startIndex: number, count: number): Place[] {
  if (places.length === 0) {
    return [];
  }

  return Array.from({ length: Math.min(count, places.length) }, (_, index) => {
    const place = places[(startIndex + index) % places.length];

    // Course.places에는 Place 타입만 들어가야 하므로 내부용 regionId는 제거합니다.
    const { regionId: _regionId, ...placeWithoutRegionId } = place;

    return placeWithoutRegionId;
  });
}

// 설문 응답을 기준으로 추천 코스 2~3개를 생성합니다.
export function buildRecommendedCourses(survey: SurveyResponse): Course[] {
  const preferredTags = getPreferredTags(survey);

  // 1. 사용자가 선택한 권역의 장소만 우선 후보로 사용합니다.
  const regionPlaces = SAMPLE_PLACES.filter((place) => {
    return place.regionId === survey.regionId;
  });

  // 2. 혹시 해당 권역 장소가 부족하면 전체 더미 데이터를 fallback으로 사용합니다.
  const candidates = regionPlaces.length >= 3 ? regionPlaces : SAMPLE_PLACES;

  // 3. 설문 조건과 장소 태그를 기준으로 점수순 정렬합니다.
  const scoredPlaces = [...candidates].sort((a, b) => {
    return scorePlace(b, survey) - scorePlace(a, survey);
  });

  // 4. 반려동물 동반 조건이 있으면 펫프렌들리 장소를 앞으로 보냅니다.
  const sortedPlaces =
    survey.petType === "none"
      ? scoredPlaces
      : [
          ...scoredPlaces.filter((place) => place.isPetFriendly),
          ...scoredPlaces.filter((place) => !place.isPetFriendly),
        ];

  // 5. 코스 카드의 기본 제목과 설명입니다.
  const courseTemplates = [
    {
      id: "course-1",
      title: "취향 맞춤 핵심 코스",
      summary: "설문 조건과 가장 잘 맞는 장소를 중심으로 구성한 추천 코스입니다.",
      estimatedStyle: "핵심 명소를 빠르게 둘러보는 코스",
      startIndex: 0,
      count: 4,
    },
    {
      id: "course-2",
      title: "여유로운 산책 코스",
      summary: "이동 부담을 줄이고 천천히 즐기기 좋은 장소를 묶은 코스입니다.",
      estimatedStyle: "산책과 휴식을 중심으로 한 코스",
      startIndex: 1,
      count: 3,
    },
    {
      id: "course-3",
      title: "사진과 맛집 중심 코스",
      summary: "사진 찍기 좋은 장소와 로컬 분위기를 함께 즐기는 코스입니다.",
      estimatedStyle: "사진, 카페, 로컬 명소 중심 코스",
      startIndex: 2,
      count: 3,
    },
  ];

  // 6. 템플릿과 정렬된 장소를 합쳐 Course 타입 배열을 만듭니다.
  return courseTemplates
    .map((template) => {
      const places = pickPlaces(sortedPlaces, template.startIndex, template.count);

      return {
        id: template.id,
        title: template.title,
        summary: template.summary,
        tags: preferredTags.slice(0, 4),
        places,
        estimatedStyle: template.estimatedStyle,
        isPetFriendly: places.some((place) => place.isPetFriendly),
        transportNote:
          survey.transportType === "public"
            ? "대중교통 접근성을 고려한 임시 추천입니다."
            : "자차 또는 렌터카 이동에 적합한 임시 추천입니다.",
        regionId: survey.regionId,
        durationLabel: "반나절",
        recommendedReason: "설문 조건과 더미 장소 태그를 기준으로 점수화했습니다.",
      } satisfies Course;
    })
    .filter((course) => course.places.length >= 3)
    .slice(0, 3);
}