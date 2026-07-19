"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import type { Course } from "@/types/course";

type CourseCardProps = {
  course: Course;
  index: number;
};

const CARD_ACCENTS = [
  {
    color: "#2563eb",
    soft: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    color: "#0f9f8f",
    soft: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    color: "#ff5a4f",
    soft: "#fff1ef",
    border: "#fecaca",
  },
];

const REGION_IMAGE_NAMES: Record<string, string> = {
  sokcho: "sokcho",
  yangyang: "yangyang",
  gangneung: "gangneung",
  donghae: "donghae",
  samcheok: "samcheok",
};

function getPlaceType(category: string) {
  if (category === "food") return "맛집";
  if (category === "stay") return "숙소";
  if (category === "leports") return "액티비티";
  return "관광";
}

function getFallbackSlides(course: Course) {
  const regionKey =
    course.regionId && REGION_IMAGE_NAMES[course.regionId]
      ? REGION_IMAGE_NAMES[course.regionId]
      : "yangyang";

  return [
    `/images/regions/${regionKey}-card.jpg`,
    `/images/regions/${regionKey}-day.jpg`,
    `/images/regions/${regionKey}-sunset.jpg`,
    `/images/regions/${regionKey}-night.jpg`,
  ];
}

export default function CourseCard({
  course,
  index,
}: CourseCardProps) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const slideImages = useMemo(() => {
    const candidates = [
      course.mainImageUrl,
      ...course.places.map((place) => place.imageUrl),
      ...getFallbackSlides(course),
    ].filter((image): image is string => Boolean(image));

    return [...new Set(candidates)].slice(0, 4);
  }, [course]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slideImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentSlide((current) =>
        current === slideImages.length - 1 ? 0 : current + 1,
      );
    }, 1500);

    return () => {
      window.clearInterval(interval);
    };
  }, [slideImages.length]);

  const moveSlide = (direction: "previous" | "next") => {
    setCurrentSlide((current) => {
      if (direction === "previous") {
        return current === 0 ? slideImages.length - 1 : current - 1;
      }

      return current === slideImages.length - 1 ? 0 : current + 1;
    });
  };

  const visiblePlaces = course.places.slice(0, 4);

  const cardStyle = {
    "--accent": accent.color,
    "--accent-soft": accent.soft,
    "--accent-border": accent.border,
  } as CSSProperties;

  return (
    <article className="courseCard" style={cardStyle}>
      <div className="imageWrap">
        {slideImages.map((image, slideIndex) => (
          <Image
            key={image}
            src={image}
            alt={`${course.title} 대표 이미지 ${slideIndex + 1}`}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
            className={`courseImage ${
              currentSlide === slideIndex ? "active" : ""
            }`}
            priority={index === 0 && slideIndex === 0}
          />
        ))}

        <span className="rankBadge">{index + 1}</span>

        <button
          type="button"
          className="heartButton"
          aria-label={`${course.title} 찜하기`}
        >
          ♡
        </button>

        {slideImages.length > 1 && (
          <>
            <button
              type="button"
              className="slideButton previousButton"
              aria-label="이전 사진"
              onClick={() => moveSlide("previous")}
            >
              ‹
            </button>

            <button
              type="button"
              className="slideButton nextButton"
              aria-label="다음 사진"
              onClick={() => moveSlide("next")}
            >
              ›
            </button>

            <div className="slideDots" aria-label="사진 슬라이드">
              {slideImages.map((image, slideIndex) => (
                <button
                  key={`${image}-dot`}
                  type="button"
                  className={currentSlide === slideIndex ? "active" : ""}
                  aria-label={`${slideIndex + 1}번째 사진 보기`}
                  onClick={() => setCurrentSlide(slideIndex)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="content">
        <h2>{course.title}</h2>

        {course.tags.length > 0 && (
          <div className="tagList">
            {course.tags.slice(0, 4).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}

        <section className="placeSection">
          <div className="sectionTitle">방문 추천 장소</div>

          <ol className="placeList">
            {visiblePlaces.map((place, placeIndex) => (
              <li key={place.id}>
                <span className="placeNumber">
                  {placeIndex + 1}
                </span>

                <div className="placeText">
                  <strong>{place.name}</strong>
                  <small>{getPlaceType(place.category)}</small>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Link
          href={`/courses/${course.id}`}
          className="detailButton"
        >
          <span>상세 보기</span>
          <strong aria-hidden="true">›</strong>
        </Link>
      </div>

      <style jsx>{`
        .courseCard {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #dbe3ed;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.07);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .courseCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
        }

        .imageWrap {
          position: relative;
          height: 225px;
          overflow: hidden;
          margin: 12px 12px 0;
          border-radius: 14px;
          background: #dbeafe;
        }

        .courseImage {
          object-fit: cover;
          opacity: 0;
          transform: scale(1.02);
          transition:
            opacity 0.45s ease,
            transform 0.6s ease;
        }

        .courseImage.active {
          opacity: 1;
          transform: scale(1);
        }

        .rankBadge {
          position: absolute;
          z-index: 4;
          top: 12px;
          left: 12px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: var(--accent);
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.2);
        }

        .heartButton {
          position: absolute;
          z-index: 4;
          top: 11px;
          right: 11px;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.2);
          color: #ffffff;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
          backdrop-filter: blur(7px);
        }

        .slideButton {
          position: absolute;
          z-index: 4;
          top: 50%;
          width: 34px;
          height: 46px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.28);
          color: #ffffff;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
          backdrop-filter: blur(5px);
          transform: translateY(-50%);
          transition: background 0.2s ease;
        }

        .slideButton:hover {
          background: rgba(15, 23, 42, 0.48);
        }

        .previousButton {
          left: 10px;
        }

        .nextButton {
          right: 10px;
        }

        .slideDots {
          position: absolute;
          z-index: 4;
          left: 50%;
          bottom: 12px;
          display: flex;
          gap: 6px;
          transform: translateX(-50%);
        }

        .slideDots button {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
          cursor: pointer;
          transition:
            width 0.2s ease,
            background 0.2s ease;
        }

        .slideDots button.active {
          width: 20px;
          border-radius: 999px;
          background: #ffffff;
        }

        .content {
          padding: 18px 16px 16px;
        }

        .content h2 {
          margin: 0;
          color: #111827;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.3;
          letter-spacing: -0.7px;
        }

        .tagList {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .tagList span {
          padding: 6px 10px;
          border-radius: 999px;
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 11px;
          font-weight: 800;
        }

        .placeSection {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .sectionTitle {
          color: #1f2937;
          font-size: 13px;
          font-weight: 900;
        }

        .placeList {
          margin: 12px 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          list-style: none;
        }

        .placeList li {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .placeNumber {
          width: 24px;
          height: 24px;
          flex: 0 0 24px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 11px;
          font-weight: 900;
        }

        .placeText {
          min-width: 0;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .placeText strong {
          overflow: hidden;
          color: #334155;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .placeText small {
          flex-shrink: 0;
          color: #94a3b8;
          font-size: 10px;
        }

        .detailButton {
          height: 50px;
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          border-radius: 10px;
          background: var(--accent);
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 8px 18px color-mix(
            in srgb,
            var(--accent) 28%,
            transparent
          );
          transition:
            filter 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .detailButton:hover {
          filter: brightness(0.92);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px color-mix(
            in srgb,
            var(--accent) 38%,
            transparent
          );
        }

        .detailButton strong {
          font-size: 23px;
          line-height: 1;
        }

        @media (max-width: 640px) {
          .imageWrap {
            height: 200px;
          }
        }
      `}</style>
    </article>
  );
}