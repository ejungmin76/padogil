"use client";

import Link from "next/link";
import PlaceTimeline from "@/components/course/PlaceTimeline";
import CourseMap from "@/components/map/CourseMap";

import type { Course } from "@/types/course";
import type { SurveyResponse } from "@/types/survey";

type CourseDetailProps = {
  course: Course;
  survey: SurveyResponse | null;
};

const TRANSPORT_LABELS = {
  car: "자차",
  public: "대중교통",
  rental: "렌터카",
} as const;

export default function CourseDetail({
  course,
  survey,
}: CourseDetailProps) {
  return (
    <main className="page">
      <div className="topBar">
        <Link href="/courses">
          ← 추천 코스로 돌아가기
        </Link>
      </div>

      <section className="hero">
        <h1>{course.title}</h1>

        <p>{course.summary}</p>

        <div className="tags">
          {course.tags.map((tag) => {
            const cleanTag = tag.replace(/^#+/, "");

            return (
              <span key={tag} className="courseTag">
                #{cleanTag}
              </span>
            );
          })}

          <span className="transportTag">
            🚙{" "}
            {survey
              ? `${TRANSPORT_LABELS[survey.transportType]} 추천`
              : "이동수단 정보 없음"}
          </span>

          <span className="petTag">
            🐾{" "}
            {course.isPetFriendly
              ? "반려동물 동반 가능"
              : "반려동물 동반 불가"}
          </span>
        </div>
      </section>

      <section className="detailGrid">
        <PlaceTimeline places={course.places} />
        <CourseMap places={course.places} />
      </section>

      <section className="bottomActions">
        <button type="button" className="exploreButton">
          <span aria-hidden="true">⌕</span>
          태그로 더 탐색
        </button>

        <Link href="/survey" className="resetCourseButton">
          <span aria-hidden="true">↻</span>
          조건 다시 선택
        </Link>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 40px;
          background: #f8fafc;
        }

        .topBar {
          max-width: 1200px;
          margin: 0 auto 20px;
        }

        .topBar a {
          color: #2563eb;
          font-weight: 800;
          text-decoration: none;
        }

        .hero {
          max-width: 1200px;
          margin: auto;
          padding: 32px;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
        }

        .hero h1 {
          margin: 0;
          color: #111827;
          font-size: 42px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .hero p {
          color: #64748b;
          line-height: 1.7;
        }

        .tags {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tags span {
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .courseTag {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #2563eb;
        }

        .transportTag {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #15803d;
        }

        .petTag {
          border: 1px solid #e2e8f0;
          background: #f1f5f9;
          color: #475569;
        }

        .detailGrid {
          width: 100%;
          max-width: 1200px;
          margin: 30px auto 0;
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(360px, 0.85fr);
          gap: 28px;
          align-items: start;
        }

        .bottomActions {
          width: 100%;
          max-width: 1200px;
          margin: 22px auto 0;
          padding: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          box-sizing: border-box;
          border: 1px solid #dbe3ed;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
        }

        .exploreButton,
        .resetCourseButton {
          width: 100%;
          height: 52px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
        }

        .exploreButton {
          border: 1px solid #0f9f8f;
          background: #ffffff;
          color: #0f766e;
        }

        .resetCourseButton {
          border: 1px solid #ff5a4f;
          background: #ff5a4f;
          color: #ffffff;
        }

        .exploreButton span,
        .resetCourseButton span {
          font-size: 22px;
        }

        @media (max-width: 900px) {
          .page {
            padding: 24px 20px;
          }

          .detailGrid {
            grid-template-columns: 1fr;
          }

          .bottomActions {
            grid-template-columns: 1fr;
          }

          .hero h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </main>
  );
}