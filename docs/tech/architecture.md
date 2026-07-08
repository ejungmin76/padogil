# 기술 구조

## 스택

- Frontend: Next.js App Router
- Styling: Tailwind CSS 권장
- Database/Auth: Supabase
- Deployment: Vercel
- External API: 한국관광공사 OpenAPI
- Map: 카카오 지도 API

## 주요 모듈

### Next.js

- 화면 라우팅
- 서버 API 라우트
- 관광공사 API 프록시
- 추천 코스 생성

### Supabase

MVP에서는 저장 기능을 최소화한다.

권장 테이블:

- `survey_responses`: 설문 응답 저장
- `saved_courses`: 찜 또는 공유용 코스 저장
- `course_feedback`: 추후 추천 개선용 피드백

### 관광공사 OpenAPI

활용 대상:

- 국문관광정보 서비스
- 관광지별 연관 관광지 정보 서비스
- 반려동물 동반여행 서비스

데이터 사용 방식:

- areaCode/sigunguCode로 권역 필터링
- contentTypeId로 장소 유형 분류
- pet travel API로 반려동물 가능 장소 필터링
- 연관 관광지 API로 코스 주변 장소 구성

## 추천 API 흐름

1. 클라이언트가 설문 결과를 `/api/course/recommend`에 보낸다.
2. 서버가 권역과 조건을 기준으로 관광공사 API를 호출한다.
3. 반려동물 조건이 있으면 펫 API 데이터를 우선 적용한다.
4. 장소 후보를 태그와 유형별로 점수화한다.
5. 2~3개 코스 카드 형태로 반환한다.

## 환경 변수

```env
TOUR_API_KEY=
NEXT_PUBLIC_KAKAO_MAP_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Vercel 배포 체크

- 환경 변수 등록
- API 키 노출 여부 확인
- `/api/*` 라우트 정상 동작 확인
- 모바일 화면 확인
- 추천 결과 빈 상태 처리
