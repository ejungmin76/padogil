# 공통 작업 규칙

## 프로젝트 한 줄 정의

파도길(PADOGIL)은 강원 동해안 권역과 여행 조건을 선택하면 한국관광공사 OpenAPI 데이터를 기반으로 2~3개의 맞춤 여행 코스를 추천하는 웹 서비스입니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Supabase
- Vercel
- 한국관광공사 OpenAPI
- 카카오 지도 API

## MVP에서 중요한 것

1. 권역 선택이 명확해야 합니다.
2. 설문 흐름이 짧고 이해하기 쉬워야 합니다.
3. 추천 결과가 2~3개 카드로 비교 가능해야 합니다.
4. 관광공사 OpenAPI를 실제로 사용해야 합니다.
5. 반려동물 조건이 추천 결과에 반영되어야 합니다.
6. 발표 시연이 끊기지 않아야 합니다.

## MVP에서 욕심내지 않을 것

- 로그인
- 리뷰 작성
- AI 추천 고도화
- 실시간 혼잡도
- 날씨 API
- 강원도 전역 확장

## GitHub 규칙

- `main`: 최종 배포 가능 상태
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 작업 브랜치

브랜치 예시:

- `feature/region-selector`
- `feature/survey-stepper`
- `feature/tour-api-client`
- `feature/kakao-map`

## PR 규칙

PR에는 아래 내용을 적습니다.

```md
## 작업 내용

## 확인 방법

## 남은 TODO

## 스크린샷 또는 응답 예시
```

## AI 사용 규칙

AI에게 요청할 때는 아래 내용을 같이 줍니다.

- 내가 맡은 역할
- 수정할 파일 경로
- 완료 기준
- 건드리면 안 되는 파일
- 기존 문서 경로

AI가 코드를 만들면 반드시 확인합니다.

- 화면이 깨지지 않는지
- TypeScript 에러가 없는지
- API 키가 노출되지 않는지
- 임시 더미 데이터와 실제 API 데이터가 섞여도 구조가 유지되는지

## 코딩 기준

- 타입은 `types/`에 둡니다.
- 관광공사 API 원본 응답 변환은 `lib/tourapi/normalize.ts`에서 처리합니다.
- 추천 로직은 `lib/recommendation/`에 둡니다.
- 화면 컴포넌트는 `components/`에 둡니다.
- API 키가 필요한 호출은 `app/api/` 서버 라우트에서만 처리합니다.
