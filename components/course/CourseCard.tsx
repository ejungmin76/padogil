"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
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
  const [isHovered, setIsHovered] = useState(false);

  /*
   * 카드에 마우스가 올라가 있을 때만 동작한다.
   *
   * currentSlide가 바뀔 때마다 타이머가 새로 시작되므로
   * 화살표나 점을 직접 누른 뒤에도 2초를 기다렸다가
   * 다음 사진으로 넘어간다.
   */
  useEffect(() => {
    if (!isHovered || slideImages.length <= 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentSlide((current) =>
        current === slideImages.length - 1
          ? 0
          : current + 1,
      );
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isHovered, currentSlide, slideImages.length]);

  /*
   * 코스 데이터가 바뀌었을 때 현재 슬라이드를
   * 첫 번째 이미지로 초기화한다.
   */
  useEffect(() => {
    setCurrentSlide(0);
  }, [course.id]);

  const moveSlide = (
    event: MouseEvent<HTMLButtonElement>,
    direction: "previous" | "next",
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (slideImages.length <= 1) {
      return;
    }

    setCurrentSlide((current) => {
      if (direction === "previous") {
        return current === 0
          ? slideImages.length - 1
          : current - 1;
      }

      return current === slideImages.length - 1
        ? 0
        : current + 1;
    });
  };

  const selectSlide = (
    event: MouseEvent<HTMLButtonElement>,
    slideIndex: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setCurrentSlide(slideIndex);
  };

  const visiblePlaces = course.places.slice(0, 4);

  const cardStyle = {
    "--accent": accent.color,
    "--accent-soft": accent.soft,
    "--accent-border": accent.border,
  } as CSSProperties;

  return (
    <article
      className="courseCard"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 20.4 10.55 19.08C5.4 14.4 2 11.32 2 7.55 2 4.47 4.42 2.05 7.5 2.05c1.74 0 3.41.81 4.5 2.09a6.02 6.02 0 0 1 4.5-2.09c3.08 0 5.5 2.42 5.5 5.5 0 3.77-3.4 6.85-8.55 11.54L12 20.4Z" />
          </svg>
        </button>

        {slideImages.length > 1 && (
          <>
            <button
              type="button"
              className="slideButton previousButton"
              aria-label="이전 사진"
              onClick={(event) =>
                moveSlide(event, "previous")
              }
            >
              ‹
            </button>

            <button
              type="button"
              className="slideButton nextButton"
              aria-label="다음 사진"
              onClick={(event) =>
                moveSlide(event, "next")
              }
            >
              ›
            </button>

            <div
              className="slideDots"
              aria-label="사진 슬라이드"
            >
              {slideImages.map((image, slideIndex) => (
                <button
                  key={`${image}-dot`}
                  type="button"
                  className={
                    currentSlide === slideIndex
                      ? "active"
                      : ""
                  }
                  aria-label={`${slideIndex + 1}번째 사진 보기`}
                  onClick={(event) =>
                    selectSlide(event, slideIndex)
                  }
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
            {course.tags.slice(0, 4).map((tag) => {
              const cleanTag = tag.replace(/^#+/, "");

              return (
                <span key={tag}>#{cleanTag}</span>
              );
            })}
          </div>
        )}

        <section className="placeSection">
          <div className="sectionTitle">
            방문 추천 장소
          </div>

          <ol className="placeList">
            {visiblePlaces.map((place, placeIndex) => (
              <li key={place.id}>
                <span className="placeNumber">
                  {placeIndex + 1}
                </span>

                <div className="placeText">
                  <strong>{place.name}</strong>
                  <small>
                    {getPlaceType(place.category)}
                  </small>
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
          box-shadow: 0 10px 28px
            rgba(15, 23, 42, 0.07);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .courseCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px
            rgba(15, 23, 42, 0.12);
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
          box-shadow: 0 6px 18px
            rgba(15, 23, 42, 0.2);
        }

        .heartButton {
          position: absolute;
          z-index: 5;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          padding: 0;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.28);
          color: #ffffff;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .heartButton svg {
          width: 21px;
          height: 21px;
          display: block;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .heartButton:hover {
          background: rgba(15, 23, 42, 0.45);
          transform: scale(1.08);
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
          opacity: 0;
          pointer-events: none;
          backdrop-filter: blur(5px);
          transform: translateY(-50%);
          transition:
            opacity 0.2s ease,
            background 0.2s ease;
        }

        .courseCard:hover .slideButton {
          opacity: 1;
          pointer-events: auto;
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
          position: relative;
          width: 100%;
          height: 48px;
          margin-top: 16px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          border: 0;
          border-radius: 10px;
          background: var(--accent);
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 7px 16px
            color-mix(
              in srgb,
              var(--accent) 25%,
              transparent
            );
          transition:
            filter 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .detailButton:hover {
          filter: brightness(0.93);
          transform: translateY(-1px);
          box-shadow: 0 10px 22px
            color-mix(
              in srgb,
              var(--accent) 35%,
              transparent
            );
        }

        .detailButton strong {
          position: absolute;
          right: 22px;
          font-size: 23px;
          font-weight: 400;
          line-height: 1;
        }

        @media (max-width: 640px) {
          .imageWrap {
            height: 200px;
          }

          .slideButton {
            opacity: 1;
            pointer-events: auto;
          }
        }
      `}</style>
    </article>
  );
}