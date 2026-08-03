"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Course } from "@/types/course";
import type { SurveyResponse } from "@/types/survey";

import CourseDetail from "@/components/course/CourseDetail";

type StoredCourseResponse = {
  courses?: Course[];
};

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<SurveyResponse | null>(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    const stored = sessionStorage.getItem("padogil-courses");
    const storedSurvey = sessionStorage.getItem("padogil-survey");

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as
        | StoredCourseResponse
        | Course[];

      const courses = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.courses)
          ? parsed.courses
          : [];

      const selectedCourse = courses.find(
        (item) => item.id === params.courseId,
      );

      if (storedSurvey) {
        const parsedSurvey = JSON.parse(
          storedSurvey,
        ) as SurveyResponse;

        setSurvey(parsedSurvey);
      }

      setCourse(selectedCourse ?? null);
    } catch (error) {
      console.error("추천 코스를 불러오지 못했습니다.", error);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, 0);

  return () => clearTimeout(timer);
}, [params.courseId]);

  if (loading) {
    return (
      <main className="loadingPage">
        <div className="spinner" />
        <p>코스 정보를 불러오고 있어요.</p>

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

  if (!course) {
    return (
      <main className="notFound">
        <h1>코스를 찾을 수 없어요</h1>
        <p>추천 코스 목록으로 돌아가 다시 선택해 주세요.</p>

        <Link href="/courses">
          추천 코스로 돌아가기
        </Link>

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
  <CourseDetail
    course={course}
    survey={survey}
  />
  );
}