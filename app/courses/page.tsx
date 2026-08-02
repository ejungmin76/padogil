"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseList from "@/components/course/CourseList";
import { SAMPLE_COURSES } from "@/lib/course/sample-courses";
import type { Course } from "@/types/course";
import type { SurveyResponse } from "@/types/survey";

type StoredCourseResponse = {
  courses?: Course[];
};

type PageState = {
  courses: Course[];
  loading: boolean;
  empty: boolean;
};


const REGION_LABELS: Record<string, string> = {
  sokcho: "속초",
  yangyang: "양양",
  gangneung: "강릉",
  donghae: "동해",
  samcheok: "삼척",
};

const PARTY_LABELS = {
  solo: "혼자",
  couple: "2인 / 커플",
  family: "가족",
  group: "단체",
};

const TRANSPORT_LABELS = {
  car: "자차",
  public: "대중교통",
  rental: "렌터카",
};

const PET_LABELS = {
  none: "동반 안 함",
  small: "소형견",
  large: "대형견",
};

const THEME_LABELS = {
  "teens-twenties": "액티비티",
  thirties: "맛집·카페",
  forties: "자연·문화",
  "fifties-plus": "힐링",
};

export default function CoursesPage() {
  const [state, setState] = useState<PageState>({
    courses: [],
    loading: true,
    empty: false,
  });

  const [survey, setSurvey] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedSurvey = sessionStorage.getItem("padogil-survey");
      const stored = sessionStorage.getItem("padogil-courses");

      if (!stored) {
        setState({
          courses: SAMPLE_COURSES,
          loading: false,
          empty: false,
        });
        return;
      }

      try {
        if (storedSurvey) {
          setSurvey(JSON.parse(storedSurvey));
        }

        const parsed = JSON.parse(stored) as
          | StoredCourseResponse
          | Course[];

        const parsedCourses = Array.isArray(parsed)
          ? parsed
          : parsed.courses;

        if (
          Array.isArray(parsedCourses) &&
          parsedCourses.length > 0
        ) {
          setState({
            courses: parsedCourses,
            loading: false,
            empty: false,
          });
          return;
        }

        if (
          Array.isArray(parsedCourses) &&
          parsedCourses.length === 0
        ) {
          setState({
            courses: [],
            loading: false,
            empty: true,
          });
          return;
        }

        setState({
          courses: SAMPLE_COURSES,
          loading: false,
          empty: false,
        });
      } catch {
        setState({
          courses: SAMPLE_COURSES,
          loading: false,
          empty: false,
        });
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const regionId = state.courses[0]?.regionId ?? "yangyang";
  const regionName = REGION_LABELS[regionId] ?? "동해안";

  if (state.loading) {
    return (
      <main className="loadingPage">
        <div className="spinner" />
        <p>추천 코스를 불러오고 있어요.</p>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: grid;
            place-content: center;
            gap: 14px;
            background: #f8fafc;
            color: #64748b;
            text-align: center;
          }

          .spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto;
            border: 4px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <Link href="/" className="logo">
          PADOGIL
        </Link>

        <nav className="nav" aria-label="주요 메뉴">
          <Link href="/">권역 선택</Link>
          <span className="active">추천 코스</span>
          <span>태그 탐색</span>
        </nav>

        <div className="headerActions">
          <span aria-hidden="true">♡</span>
          <span>찜 목록</span>
          <span aria-hidden="true">♙</span>
          <span>내 여행</span>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <h2>선택한 조건</h2>

          <div className="conditionList">
            <div className="condition">
              <span className="conditionIcon">⌖</span>
              <div>
                <small>여행지</small>
                <strong>{regionName}</strong>
              </div>
            </div>

            <div className="condition">
              <span className="conditionIcon">♙</span>
              <div>
                <small>여행 타입</small>
                <strong>
                  {survey ? PARTY_LABELS[survey.partyType] : "-"}
                </strong>
              </div>
            </div>

            <div className="condition">
              <span className="conditionIcon">▣</span>
              <div>
                <small>이동 수단</small>
                <strong>
                  {survey ? TRANSPORT_LABELS[survey.transportType] : "-"}
                </strong>
              </div>
            </div>

            <div className="condition">
              <span className="conditionIcon">◌</span>
              <div>
                <small>반려동물</small>
                <strong>
                  {survey ? PET_LABELS[survey.petType] : "-"}
                </strong>
              </div>
            </div>
          </div>

          <div className="sidebarDivider" />

          <h3>관심 테마</h3>

          <div className="interestTags">
            {survey && (
              <span>{THEME_LABELS[survey.ageGroup]}</span>
            )}
          </div>

          <div className="sidebarInfo">
            <span>🛡</span>
            <p>관광공사 데이터 기반 추천</p>
          </div>
        </aside>

        <section className="contentArea">
          <div className="titleRow">
            <div>
              <h1>
                <span className="regionAccent">
                  {regionName}
                </span>{" "}
                맞춤 코스를 찾았어요
              </h1>

              <p>
                설문 결과와 선택한 여행 조건을 반영한 추천
                코스입니다.
              </p>
            </div>

            <Link href="/survey" className="resetButton">
              ↻ 조건 다시 선택
            </Link>
          </div>

          {state.empty ? (
            <section className="emptyState">
              <span>〰</span>
              <h2>추천된 코스가 아직 없어요</h2>
              <p>
                여행 조건을 다시 선택하고 새로운 코스를
                추천받아 보세요.
              </p>
              <Link href="/survey">설문 다시 하기</Link>
            </section>
          ) : (
            <>
              <div className="resultSummary">
                <strong>
                  {state.courses.length}개의 추천 코스
                </strong>
                <span>
                  마음에 드는 코스를 선택해 상세 일정을 확인해
                  보세요.
                </span>
              </div>

              <CourseList courses={state.courses} />

              <div className="dataNotice">
                <span>ⓘ</span>
                이 코스는 관광 데이터와 설문 결과를 기반으로
                추천되었습니다.
              </div>
            </>
          )}
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
          color: #111827;
        }

        .header {
          height: 56px;
          padding: 0 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
        }

        .logo {
          color: #1463d8;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.9px;
          text-decoration: none;
        }

        .nav {
          height: 100%;
          display: flex;
          align-items: center;
          gap: 48px;
          font-size: 14px;
          font-weight: 800;
        }

        .nav a,
        .nav span {
          height: 100%;
          display: flex;
          align-items: center;
          color: #111827;
          text-decoration: none;
        }

        .nav .active {
          color: #1d4ed8;
          border-bottom: 3px solid #2563eb;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .headerActions span:nth-child(1),
        .headerActions span:nth-child(3) {
          font-size: 22px;
        }

        .layout {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px 28px 24px;
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          gap: 28px;
          box-sizing: border-box;
        }

        .sidebar {
          align-self: start;
          padding: 20px 16px;
          border: 1px solid #dbe3ed;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .sidebar h2,
        .sidebar h3 {
          margin: 0;
          color: #1f2937;
          font-size: 17px;
        }

        .sidebar h3 {
          font-size: 14px;
        }

        .conditionList {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .condition {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .conditionIcon {
          width: 26px;
          color: #64748b;
          font-size: 21px;
          text-align: center;
        }

        .condition div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .condition small {
          color: #94a3b8;
          font-size: 10px;
        }

        .condition strong {
          overflow: hidden;
          color: #0f9f8f;
          font-size: 13px;
          font-weight: 900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebarDivider {
          margin: 20px 0;
          border-top: 1px solid #e5e7eb;
        }

        .interestTags {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .interestTags span {
          padding: 6px 10px;
          border: 1px solid #5eead4;
          border-radius: 8px;
          color: #0f766e;
          font-size: 11px;
          font-weight: 800;
        }

        .sidebarInfo {
          margin-top: 20px;
          padding-top: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #e5e7eb;
          color: #64748b;
        }

        .sidebarInfo p {
          margin: 0;
          font-size: 10px;
          line-height: 1.4;
        }

        .contentArea {
          min-width: 0;
        }

        .titleRow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .titleRow h1 {
          margin: 0;
          color: #111827;
          font-size: clamp(32px, 3vw, 44px);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -1.5px;
        }

        .regionAccent {
          color: #0f9f8f;
        }

        .titleRow p {
          margin: 12px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .resetButton {
          flex-shrink: 0;
          min-width: 150px;
          height: 40px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #60a5fa;
          border-radius: 9px;
          background: #ffffff;
          color: #2563eb;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 5px 14px rgba(37, 99, 235, 0.1);
        }

        .resultSummary {
          margin: 18px 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .resultSummary strong {
          color: #334155;
          font-size: 13px;
        }

        .resultSummary span {
          color: #94a3b8;
          font-size: 10px;
        }

        .dataNotice {
          margin-top: 18px;
          padding: 11px 14px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #dbe3ed;
          border-radius: 10px;
          background: #ffffff;
          color: #64748b;
          font-size: 10px;
        }

        .dataNotice span {
          color: #2563eb;
          font-size: 18px;
        }

        .emptyState {
          min-height: 360px;
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed #cbd5e1;
          border-radius: 20px;
          background: #ffffff;
          text-align: center;
        }

        .emptyState > span {
          color: #0f9f8f;
          font-size: 46px;
        }

        .emptyState h2 {
          margin: 12px 0 0;
        }

        .emptyState p {
          color: #64748b;
        }

        .emptyState a {
          margin-top: 16px;
          padding: 12px 18px;
          border-radius: 9px;
          background: #0f9f8f;
          color: #ffffff;
          font-weight: 800;
          text-decoration: none;
        }

        @media (max-width: 1050px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }
        }

        @media (max-width: 760px) {
          .header {
            padding: 0 20px;
          }

          .nav,
          .headerActions {
            display: none;
          }

          .layout {
            padding: 24px 20px 42px;
          }

          .titleRow {
            flex-direction: column;
          }

          .resetButton {
            width: 100%;
          }

          .resultSummary {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}