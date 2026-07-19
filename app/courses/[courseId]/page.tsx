"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SAMPLE_COURSES } from "@/lib/course/sample-courses";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();

  const course = SAMPLE_COURSES.find(
    (item) => item.id === params.courseId,
  );

  if (!course) {
    return (
      <main className="notFound">
        <h1>코스를 찾을 수 없어요</h1>
        <p>추천 코스 목록으로 돌아가 다시 선택해 주세요.</p>
        <Link href="/courses">추천 코스로 돌아가기</Link>

        <style jsx>{`
          .notFound {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            text-align: center;
          }

          .notFound h1 {
            margin: 0;
          }

          .notFound p {
            color: #64748b;
          }

          .notFound a {
            margin-top: 14px;
            padding: 12px 18px;
            border-radius: 10px;
            background: #2563eb;
            color: #ffffff;
            font-weight: 800;
            text-decoration: none;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="topBar">
        <Link href="/courses">← 추천 코스로 돌아가기</Link>
      </div>

      <section className="hero">
        <span>{course.durationLabel ?? "추천 코스"}</span>
        <h1>{course.title}</h1>
        <p>{course.summary}</p>
      </section>

      <section className="content">
        <div>
          <h2>주요 장소</h2>

          <ol>
            {course.places.map((place) => (
              <li key={place.id}>
                <strong>{place.name}</strong>
                <span>{place.address}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside>
          <h2>코스 정보</h2>
          <p>
            <strong>스타일</strong>
            {course.estimatedStyle ?? "맞춤 추천 여행"}
          </p>
          <p>
            <strong>이동 안내</strong>
            {course.transportNote ?? "상세 이동 정보를 확인해 주세요."}
          </p>
          <p>
            <strong>반려동물</strong>
            {course.isPetFriendly ? "동반 가능" : "동반 어려움"}
          </p>
        </aside>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 40px;
          background: #f8fafc;
          color: #111827;
        }

        .topBar,
        .hero,
        .content {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .topBar a {
          color: #2563eb;
          font-weight: 800;
          text-decoration: none;
        }

        .hero {
          margin-top: 40px;
          padding: 32px;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
        }

        .hero span {
          color: #0f766e;
          font-size: 12px;
          font-weight: 900;
        }

        .hero h1 {
          margin: 10px 0 0;
          font-size: 40px;
        }

        .hero p {
          color: #64748b;
          line-height: 1.7;
        }

        .content {
          margin-top: 24px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
        }

        .content > div,
        .content aside {
          padding: 26px;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
        }

        .content h2 {
          margin-top: 0;
        }

        .content ol {
          margin: 0;
          padding-left: 22px;
        }

        .content li {
          margin-bottom: 18px;
        }

        .content li strong,
        .content li span {
          display: block;
        }

        .content li span {
          margin-top: 4px;
          color: #64748b;
          font-size: 13px;
        }

        .content aside p {
          display: flex;
          flex-direction: column;
          gap: 5px;
          color: #475569;
        }

        @media (max-width: 760px) {
          .page {
            padding: 24px 20px;
          }

          .hero h1 {
            font-size: 30px;
          }

          .content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}