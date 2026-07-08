# 파일 구조

```txt
app/
  page.tsx
  survey/
    page.tsx
  courses/
    page.tsx
    [courseId]/
      page.tsx
  explore/
    page.tsx
  api/
    tour/
      search/
        route.ts
      detail/
        route.ts
      pet/
        route.ts
    course/
      recommend/
        route.ts

components/
  survey/
    RegionSelector.tsx
    SurveyStepper.tsx
    SurveyOptionCard.tsx
  course/
    CourseCard.tsx
    CourseTimeline.tsx
    CourseTagList.tsx
  map/
    KakaoMap.tsx
    PlaceMarker.tsx

lib/
  tourapi/
    client.ts
    regions.ts
    content-types.ts
    normalize.ts
  recommendation/
    score.ts
    build-course.ts
    tags.ts
  supabase/
    client.ts
    server.ts

types/
  place.ts
  survey.ts
  course.ts
```

## 설계 원칙

- 관광공사 원본 응답은 `lib/tourapi/normalize.ts`에서 내부 타입으로 변환한다.
- 추천 로직은 화면 컴포넌트와 분리해서 `lib/recommendation`에 둔다.
- API 키가 필요한 호출은 서버 라우트에서만 수행한다.
- 화면은 먼저 더미 데이터로 완성하고, 이후 API 결과를 연결한다.
- Supabase 저장 기능은 MVP 핵심 흐름 이후 붙인다.
