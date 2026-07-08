# 백엔드/API 담당 AI 작업 지시서

## 담당 목표

한국관광공사 OpenAPI와 Supabase를 연결하고, 설문 조건 기반 추천 코스 API를 만듭니다.

## 우선 작업

1. 관광공사 OpenAPI 클라이언트 구현
2. 국문관광정보 검색 API 라우트 구현
3. 반려동물 동반여행 API 라우트 구현
4. 추천 코스 생성 API 구현
5. Supabase 스키마 초안 작성

## 주로 수정할 파일

```txt
app/api/tour/search/route.ts
app/api/tour/detail/route.ts
app/api/tour/pet/route.ts
app/api/course/recommend/route.ts
lib/tourapi/
lib/recommendation/
lib/supabase/
types/place.ts
types/course.ts
types/survey.ts
docs/tech/architecture.md
```

## 건드리지 않을 파일

```txt
app/page.tsx
app/survey/page.tsx
app/courses/page.tsx
app/explore/page.tsx
components/
app/globals.css
```

프론트엔드 담당과 충돌을 줄이기 위해 화면 파일은 직접 수정하지 않습니다.

## API 요구사항

### 관광공사 API

필수 활용:

- 국문관광정보 서비스
- 관광지별 연관 관광지 정보 서비스
- 반려동물 동반여행 서비스

필터 기준:

- 지역: 강원 동해안 권역
- 유형: 관광지, 음식점, 숙박, 레포츠
- 조건: 동반 인원, 이동수단, 반려동물, 연령대

### 추천 API

엔드포인트:

```txt
POST /api/course/recommend
```

요청 예시:

```json
{
  "regionId": "yangyang",
  "partyType": "solo",
  "transportType": "car",
  "petType": "none",
  "ageGroup": "twenties"
}
```

응답 예시:

```json
{
  "courses": [
    {
      "id": "course-1",
      "title": "바다 감성 코스",
      "summary": "해변, 카페, 산책 동선을 중심으로 구성한 코스",
      "tags": ["#오션뷰", "#카페"],
      "places": []
    }
  ]
}
```

## Supabase 권장 테이블

```sql
create table survey_responses (
  id uuid primary key default gen_random_uuid(),
  region_id text not null,
  party_type text not null,
  transport_type text not null,
  pet_type text not null,
  age_group text not null,
  created_at timestamptz not null default now()
);

create table saved_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  survey_response_id uuid references survey_responses(id),
  course_payload jsonb not null,
  created_at timestamptz not null default now()
);
```

## 완료 기준

- API 키가 클라이언트에 노출되지 않습니다.
- 관광공사 API 실패 시 빈 결과 또는 에러 메시지를 안전하게 반환합니다.
- 추천 API가 항상 2~3개 코스 형태를 반환합니다.
- 반려동물 조건이 있으면 펫 API 데이터를 우선합니다.
- 프론트엔드가 쓰기 쉬운 내부 타입으로 응답을 정규화합니다.

## AI에게 그대로 줄 프롬프트

```txt
나는 파도길(PADOGIL) 프로젝트의 백엔드/API 담당입니다.
Next.js App Router route handler + TypeScript 기반으로 작업합니다.

먼저 아래 문서를 읽고 작업해주세요.
- docs/team/common-rules.md
- docs/product/user-flow.md
- docs/product/mvp-scope.md
- docs/tech/architecture.md
- docs/tech/file-structure.md
- docs/team/backend-ai-brief.md

내 담당은 한국관광공사 OpenAPI, 추천 코스 API, Supabase 구조입니다.
화면 파일과 CSS는 수정하지 마세요.

완료 기준:
- API 키 서버에서만 사용
- POST /api/course/recommend 구현
- 관광공사 응답을 types/place.ts, types/course.ts 형태로 정규화
- 반려동물 조건 필터 반영
- TypeScript 에러 없음
```
