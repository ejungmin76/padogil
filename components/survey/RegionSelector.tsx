"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RegionId } from "@/types/survey";

type TimePhase = "night" | "sunset" | "day";
type UIRegionId = RegionId | "sokcho";

type Region = {
  id: UIRegionId;
  name: string;
  tags: string[];
  imageClass: string;
};

type MapMarker = {
  id: UIRegionId;
  name: string;
  className: string;
};

const REGIONS: Region[] = [
  {
    id: "sokcho",
    name: "속초",
    tags: ["맛집", "시장", "설악산"],
    imageClass: "sokcho",
  },
  {
    id: "yangyang",
    name: "양양",
    tags: ["서핑", "청년여행", "액티비티"],
    imageClass: "yangyang",
  },
  {
    id: "gangneung",
    name: "강릉",
    tags: ["커피거리", "해변", "오션뷰"],
    imageClass: "gangneung",
  },
  {
    id: "donghae",
    name: "동해",
    tags: ["일출명소", "논골담길", "바다열차"],
    imageClass: "donghae",
  },
  {
    id: "samcheok",
    name: "삼척",
    tags: ["해안절경", "레일바이크", "동굴"],
    imageClass: "samcheok",
  },
];

const MAP_MARKERS: MapMarker[] = [
  { id: "sokcho", name: "속초", className: "sokchoMarker" },
  { id: "yangyang", name: "양양", className: "yangyangMarker" },
  { id: "gangneung", name: "강릉", className: "gangneungMarker" },
  { id: "donghae", name: "동해", className: "donghaeMarker" },
  { id: "samcheok", name: "삼척", className: "samcheokMarker" },
];

const PREVIEW_IMAGES: Record<
  UIRegionId,
  Record<TimePhase, string>
> = {
  sokcho: {
    day: "/images/regions/sokcho-day.jpg",
    sunset: "/images/regions/sokcho-sunset.jpg",
    night: "/images/regions/sokcho-night.jpg",
  },
  yangyang: {
    day: "/images/regions/yangyang-day.jpg",
    sunset: "/images/regions/yangyang-sunset.jpg",
    night: "/images/regions/yangyang-night.jpg",
  },
  gangneung: {
    day: "/images/regions/gangneung-day.jpg",
    sunset: "/images/regions/gangneung-sunset.jpg",
    night: "/images/regions/gangneung-night.jpg",
  },
  donghae: {
    day: "/images/regions/donghae-day.jpg",
    sunset: "/images/regions/donghae-sunset.jpg",
    night: "/images/regions/donghae-night.jpg",
  },
  samcheok: {
    day: "/images/regions/samcheok-day.jpg",
    sunset: "/images/regions/samcheok-sunset.jpg",
    night: "/images/regions/samcheok-night.jpg",
  },
};

export default function RegionSelector() {
  const router = useRouter();

  const [selectedRegion, setSelectedRegion] =
    useState<UIRegionId>("yangyang");
  const [timeValue, setTimeValue] = useState(100);
  const [hoveredMapRegion, setHoveredMapRegion] =
    useState<UIRegionId | null>(null);

  const timePhase: TimePhase =
    timeValue < 34 ? "night" : timeValue < 70 ? "sunset" : "day";

  const nightOpacity =
    timeValue < 50 ? Math.min(1, (50 - timeValue) / 35) : 0;

  const sunsetOpacity =
    timeValue <= 50
      ? Math.max(0, timeValue / 50)
      : Math.max(0, (100 - timeValue) / 50);

  const dayOpacity =
    timeValue > 50 ? Math.min(1, (timeValue - 50) / 40) : 0;

  const getTimeText = () => {
    if (timePhase === "night") return "고요한 밤바다";
    if (timePhase === "sunset") return "노을 지는 동해안";
    return "햇살 가득한 동해안";
  };

  const getTimeBadge = () => {
    if (timePhase === "night") return "밤";
    if (timePhase === "sunset") return "노을";
    return "낮";
  };

  const getPreviewDescription = (regionName: string) => {
    if (timePhase === "night") {
      return `${regionName}의 잔잔한 야경과 고요한 밤바다`;
    }

    if (timePhase === "sunset") {
      return `${regionName} 해안에 붉게 번지는 노을 풍경`;
    }

    return `${regionName}의 푸른 바다와 선명한 해안 풍경`;
  };

  const handleSelect = (regionId: UIRegionId) => {
    setSelectedRegion(regionId);
  };

  const handleStartSurvey = () => {
    localStorage.setItem("selectedRegion", selectedRegion);
    router.push(`/survey?region=${selectedRegion}`);
  };

  const boatFilter =
    timePhase === "night"
      ? "brightness(0.55) saturate(0.75)"
      : timePhase === "sunset"
        ? "sepia(0.3) saturate(1.2)"
        : "none";

  const mapTextColor =
    timePhase === "night"
      ? "#d9efff"
      : timePhase === "sunset"
        ? "#78350f"
        : "#0f766e";

  return (
    <div className="page">
      <header className="header">
        <div className="logo">PADOGIL</div>

        <nav className="nav" aria-label="주요 메뉴">
          <span className="active">권역 선택</span>
          <span>추천 코스</span>
          <span>태그 탐색</span>
        </nav>

        <div className="userIcon" aria-hidden="true">
          ♡
        </div>
      </header>

      <main className="main">
        <section className="left">
          <h1>강원 동해안, 어디로 떠날까요?</h1>

          <p className="subtitle">
            여행을 떠나기 전, 가고 싶은 권역을 선택해 보세요.
            <br />
            취향에 딱 맞는 맞춤 코스를 추천해 드릴게요.
          </p>

          <div className={`mapBox ${timePhase}`}>
            <div
              className="mapBackground dayBackground"
              style={{ opacity: dayOpacity }}
            />
            <div
              className="mapBackground sunsetBackground"
              style={{ opacity: sunsetOpacity }}
            />
            <div
              className="mapBackground nightBackground"
              style={{ opacity: nightOpacity }}
            />

            <div
              className="landLayer dayLand"
              style={{ opacity: dayOpacity }}
            />
            <div
              className="landLayer sunsetLand"
              style={{ opacity: sunsetOpacity }}
            />
            <div
              className="landLayer nightLand"
              style={{ opacity: nightOpacity }}
            />

            <div className="landDecor" aria-hidden="true">
              <span className="decorCloud decorCloud1">☁</span>
              <span className="decorCloud decorCloud2">☁</span>
              <span className="decorMountain decorMountain1">▲</span>
              <span className="decorMountain decorMountain2">▲</span>
              <span className="decorPath" />
            </div>

            <div className="timeController">
              <div className="timeControllerTop">
                <span className="timeIcon moonIcon" aria-hidden="true">
                  ☾
                </span>
                <span className="timeText">{getTimeText()}</span>
                <span className="timeIcon sunIcon" aria-hidden="true">
                  ☀
                </span>
              </div>

              <input
                className="timeSlider"
                type="range"
                min="0"
                max="100"
                value={timeValue}
                aria-label="지도 시간대 조절"
                onChange={(event) =>
                  setTimeValue(Number(event.target.value))
                }
                style={{
                  background: `linear-gradient(
                    90deg,
                    #29345f 0%,
                    #29345f ${timeValue}%,
                    rgba(255, 255, 255, 0.55) ${timeValue}%,
                    rgba(255, 255, 255, 0.55) 100%
                  )`,
                }}
              />
            </div>

            {MAP_MARKERS.map((marker) => (
              <div
                key={marker.id}
                className={`mapMarker ${marker.className}`}
                onMouseEnter={() => setHoveredMapRegion(marker.id)}
                onMouseLeave={() => setHoveredMapRegion(null)}
              >
                <button
                  type="button"
                  className="mapLabel"
                  onClick={() => handleSelect(marker.id)}
                  onFocus={() => setHoveredMapRegion(marker.id)}
                  onBlur={() => setHoveredMapRegion(null)}
                >
                  {marker.name}
                </button>

                {hoveredMapRegion === marker.id && (
                  <div className="regionPreview">
                    <div className="previewImageWrapper">
                      <Image
                        src={PREVIEW_IMAGES[marker.id][timePhase]}
                        alt={`${getTimeText()}의 ${marker.name} 풍경`}
                        className="previewImage"
                        fill
                        sizes="200px"
                      />
                      <div className="previewTimeBadge">
                        {getTimeBadge()}
                      </div>
                    </div>

                    <div className="previewContent">
                      <strong>{marker.name}</strong>
                      <span>
                        {getPreviewDescription(marker.name)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="stars" style={{ opacity: nightOpacity }}>
              <span className="star star1">✦</span>
              <span className="star star2">·</span>
              <span className="star star3">✦</span>
              <span className="star star4">·</span>
              <span className="star star5">✦</span>
            </div>

            <div
              className="celestialObject sunObject"
              style={{
                opacity: dayOpacity,
                transform: `translateY(${(100 - timeValue) * 0.16}px)`,
              }}
            />

            <div
              className="celestialObject moonObject"
              style={{
                opacity: nightOpacity,
                transform: `translateY(${timeValue * 0.12}px)`,
              }}
            >
              ☾
            </div>

            <div
              className="boat boat1"
              style={{ filter: boatFilter }}
              aria-hidden="true"
            >
              ⛵
            </div>
            <div
              className="boat boat2"
              style={{ filter: boatFilter }}
              aria-hidden="true"
            >
              ⛵
            </div>
            <div
              className="boat boat3"
              style={{ filter: boatFilter }}
              aria-hidden="true"
            >
              ⛵
            </div>

            <div
              className="mapText"
              style={{ color: mapTextColor }}
            >
              <span>〰 파도 따라, 취향 따라</span>
              <strong>나만의 동해안 여행</strong>
            </div>
          </div>

          <div className="infoBox">
            <div>
              <strong>5개 주요 권역</strong>
              <span>강원 동해안 핵심 지역</span>
            </div>
            <div>
              <strong>취향 맞춤 추천</strong>
              <span>설문 기반 개인화 코스</span>
            </div>
            <div>
              <strong>다양한 테마 여행</strong>
              <span>해변, 맛집, 액티비티까지</span>
            </div>
          </div>
        </section>

        <section className="right" aria-label="여행 권역 선택">
          {REGIONS.map((region) => {
            const isSelected = selectedRegion === region.id;

            return (
              <article
                key={region.id}
                className={`card ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(region.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect(region.id);
                  }
                }}
              >
                <div className={`cardImage ${region.imageClass}`}>
                  {isSelected && (
                    <div className="check" aria-label="선택됨">
                      ✓
                    </div>
                  )}
                </div>

                <div className="cardBody">
                  <div className="cardTitleRow">
                    <h2>{region.name}</h2>
                    <span aria-hidden="true">›</span>
                  </div>

                  <div className="tags">
                    {region.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  {isSelected && (
                    <button
                      type="button"
                      className="startButton"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleStartSurvey();
                      }}
                    >
                      설문 시작
                      <span aria-hidden="true">›</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="footer">
        <div>
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>고객문의</span>
        </div>
        <p>© PADOGIL. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
        }

        .header {
          height: 72px;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .logo {
          font-size: 30px;
          font-weight: 900;
          color: #0f3f78;
          letter-spacing: -1px;
        }

        .nav {
          display: flex;
          gap: 56px;
          font-size: 16px;
          font-weight: 600;
        }

        .nav span {
          height: 72px;
          display: flex;
          align-items: center;
          color: #111827;
        }

        .nav .active {
          color: #1d4ed8;
          border-bottom: 3px solid #2563eb;
        }

        .userIcon {
          font-size: 28px;
        }

        .main {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding: 40px 48px 36px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(560px, 1.05fr);
          gap: 64px;
          box-sizing: border-box;
        }

        .left,
        .right {
          min-width: 0;
        }

        h1 {
          margin: 0 0 18px;
          font-size: clamp(34px, 3vw, 42px);
          line-height: 1.25;
          letter-spacing: -1.4px;
        }

        .subtitle {
          margin: 0 0 28px;
          font-size: 17px;
          line-height: 1.7;
          color: #64748b;
        }

        .mapBox {
          position: relative;
          height: 470px;
          overflow: visible;
          border-radius: 20px;
          background: #6dc8e9;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
          isolation: isolate;
        }

        .mapBox::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          border-radius: inherit;
          box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.08);
        }

        .mapBackground {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
          transition: opacity 0.25s ease;
        }

        .dayBackground {
          z-index: -6;
          background:
            radial-gradient(
              circle at 75% 22%,
              rgba(255, 255, 255, 0.3),
              transparent 17%
            ),
            linear-gradient(
              145deg,
              #99def6 0%,
              #66c2e5 55%,
              #75cce9 100%
            );
        }

        .sunsetBackground {
          z-index: -5;
          background:
            radial-gradient(
              circle at 72% 28%,
              rgba(255, 222, 151, 0.68),
              transparent 19%
            ),
            linear-gradient(
              155deg,
              #7b86bf 0%,
              #db8593 32%,
              #f3a460 62%,
              #dc7858 100%
            );
        }

        .nightBackground {
          z-index: -4;
          background:
            radial-gradient(
              circle at 75% 18%,
              rgba(136, 179, 225, 0.23),
              transparent 17%
            ),
            linear-gradient(
              150deg,
              #162342 0%,
              #1f3d62 52%,
              #163b5b 100%
            );
        }

        .landLayer {
          position: absolute;
          z-index: -2;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
          clip-path: polygon(
            0% 0%,
            35% 0%,
            42% 13%,
            46% 27%,
            51% 41%,
            55% 55%,
            59% 68%,
            63% 82%,
            67% 100%,
            0% 100%
          );
          transition: opacity 0.25s ease;
        }

        .dayLand {
          background: linear-gradient(145deg, #d9f4d0 0%, #c7ebbe 100%);
        }

        .sunsetLand {
          background: linear-gradient(145deg, #e7b67f 0%, #b98368 100%);
        }

        .nightLand {
          background: linear-gradient(145deg, #263e49 0%, #1d303a 100%);
        }

        .landDecor {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          transition:
            filter 0.25s ease,
            opacity 0.25s ease;
        }

        .sunset .landDecor {
          filter: sepia(0.35) saturate(0.9) brightness(0.92);
        }

        .night .landDecor {
          filter: brightness(0.52) saturate(0.65);
          opacity: 0.82;
        }

        .decorCloud,
        .decorMountain {
          position: absolute;
          user-select: none;
        }

        .decorCloud {
          color: rgba(255, 255, 255, 0.72);
          font-size: 30px;
          text-shadow: 0 3px 10px rgba(255, 255, 255, 0.22);
        }

        .decorCloud1 {
          top: 23%;
          left: 7%;
        }

        .decorCloud2 {
          top: 58%;
          left: 24%;
          font-size: 20px;
        }

        .decorMountain {
          color: #73b88a;
          font-size: 34px;
          line-height: 1;
          text-shadow:
            -12px 5px 0 #93c99c,
            12px 6px 0 #5ca879;
        }

        .decorMountain1 {
          top: 15%;
          left: 10%;
        }

        .decorMountain2 {
          top: 68%;
          left: 29%;
          transform: scale(0.8);
        }

        .decorPath {
          position: absolute;
          top: 29%;
          left: 17%;
          width: 110px;
          height: 155px;
          border-left: 2px dashed rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: rotate(-18deg);
        }

        .timeController {
          position: absolute;
          z-index: 12;
          top: 6px;
          left: 50%;
          width: min(310px, calc(100% - 40px));
          padding: 10px 16px 12px;
          border: 1px solid rgba(255, 255, 255, 0.62);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.13);
          backdrop-filter: blur(12px);
          transform: translateX(-50%);
        }

        .timeControllerTop {
          margin-bottom: 7px;
          display: grid;
          grid-template-columns: 30px 1fr 30px;
          align-items: center;
          gap: 8px;
        }

        .timeText {
          color: #334155;
          font-size: 12px;
          font-weight: 800;
          text-align: center;
        }

        .timeIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .moonIcon {
          color: #405382;
        }

        .sunIcon {
          color: #f59e0b;
        }

        .timeSlider {
          width: 100%;
          height: 6px;
          display: block;
          border: 0;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }

        .timeSlider::-webkit-slider-thumb {
          width: 21px;
          height: 21px;
          border: 3px solid #ffffff;
          border-radius: 50%;
          background: #334155;
          box-shadow: 0 3px 9px rgba(15, 23, 42, 0.3);
          cursor: grab;
          appearance: none;
          -webkit-appearance: none;
        }

        .timeSlider::-moz-range-thumb {
          width: 17px;
          height: 17px;
          border: 3px solid #ffffff;
          border-radius: 50%;
          background: #334155;
          box-shadow: 0 3px 9px rgba(15, 23, 42, 0.3);
          cursor: grab;
        }

        .mapMarker {
          position: absolute;
          z-index: 30;
          overflow: visible;
        }

        .mapMarker:hover,
        .mapMarker:focus-within {
          z-index: 200;
        }

        .sokchoMarker {
          top: 20%;
          left: 32%;
        }

        .yangyangMarker {
          top: 34%;
          left: 38%;
        }

        .gangneungMarker {
          top: 53%;
          left: 47%;
        }

        .donghaeMarker {
          top: 67%;
          left: 53%;
        }

        .samcheokMarker {
          top: 81%;
          left: 59%;
        }

        .mapLabel {
          min-width: 76px;
          height: 36px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.94);
          color: #334155;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 5px 14px rgba(15, 23, 42, 0.14);
          cursor: pointer;
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .mapLabel:hover,
        .mapLabel:focus-visible {
          background: #ffffff;
          box-shadow: 0 9px 20px rgba(15, 23, 42, 0.2);
          transform: translateY(-3px);
          outline: none;
        }

        .regionPreview {
          position: absolute;
          z-index: 300;
          top: 50%;
          left: calc(100% + 12px);
          width: 200px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.22);
          pointer-events: none;
          transform: translateY(-50%);
          animation: previewAppear 0.2s ease forwards;
        }

        .sokchoMarker .regionPreview {
          top: -35px;
          left: calc(100% + 35px);
        }

        .yangyangMarker .regionPreview {
          top: -45px;
          left: calc(100% + 12px);
        }

        .gangneungMarker .regionPreview {
          top: -80px;
          left: calc(100% + 12px);
        }

        .donghaeMarker .regionPreview {
          top: -150px;
          bottom: auto;
          left: calc(100% + 12px);
          transform: none;
          animation: lowerpreviewAppear 0.2s ease forwards;
        }

        .samcheokMarker .regionPreview {
          top: -210px;     
          left: calc(100% + -5px);      
          bottom: auto;
          transform: none;
          animation: lowerPreviewAppear 0.2s ease forwards;
        }

        @keyframes lowerpreviewAppear {
          from {
            opacity: 0;
            transform: translate(-8px, 6px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }

        .previewImageWrapper {
          position: relative;
          height: 105px;
          overflow: hidden;
          background: #cbd5e1;
        }

        .previewImage {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          animation: previewImageAppear 0.35s ease;
        }

        .previewTimeBadge {
          position: absolute;
          top: 9px;
          right: 9px;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.7);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          backdrop-filter: blur(6px);
        }

        .previewContent {
          padding: 12px 13px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .previewContent strong {
          color: #0f172a;
          font-size: 15px;
        }

        .previewContent span {
          color: #64748b;
          font-size: 12px;
          line-height: 1.45;
        }

        @keyframes previewAppear {
          from {
            opacity: 0;
            transform: translate(-8px, -50%) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(0, -50%) scale(1);
          }
        }

        @keyframes previewImageAppear {
          from {
            opacity: 0;
            transform: scale(1.04);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .celestialObject {
          position: absolute;
          z-index: 1;
          pointer-events: none;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .sunObject {
          top: 78px;
          right: 44px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #fff4b8;
          box-shadow:
            0 0 25px rgba(255, 235, 151, 0.9),
            0 0 55px rgba(255, 213, 100, 0.55);
        }

        .moonObject {
          top: 75px;
          right: 48px;
          color: #f0f5ff;
          font-size: 58px;
          line-height: 1;
          text-shadow:
            0 0 16px rgba(223, 236, 255, 0.72),
            0 0 35px rgba(174, 204, 255, 0.42);
        }

        .stars {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .star {
          position: absolute;
          color: rgba(255, 255, 255, 0.88);
          animation: starTwinkle 2.2s ease-in-out infinite alternate;
        }

        .star1 {
          top: 26%;
          left: 72%;
        }

        .star2 {
          top: 36%;
          left: 88%;
          font-size: 28px;
          animation-delay: 0.4s;
        }

        .star3 {
          top: 59%;
          left: 91%;
          font-size: 13px;
          animation-delay: 0.8s;
        }

        .star4 {
          top: 72%;
          left: 72%;
          font-size: 24px;
          animation-delay: 1.1s;
        }

        .star5 {
          top: 18%;
          left: 89%;
          font-size: 11px;
          animation-delay: 1.5s;
        }

        @keyframes starTwinkle {
          from {
            opacity: 0.35;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        .boat {
          position: absolute;
          z-index: 3;
          user-select: none;
          transition:
            filter 0.25s ease,
            opacity 0.25s ease;
        }

        .boat1 {
          top: 23%;
          left: 70%;
          font-size: 31px;
          transform: translate(-50%, -50%) rotate(-4deg);
        }

        .boat2 {
          top: 54%;
          left: 82%;
          font-size: 38px;
          transform: translate(-50%, -50%) rotate(4deg);
        }

        .boat3 {
          top: 82%;
          left: 78%;
          font-size: 28px;
          opacity: 0.85;
          transform: translate(-50%, -50%) rotate(-6deg);
        }

        .mapText {
          position: absolute;
          z-index: 6;
          left: 26px;
          bottom: 26px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 15px;
          line-height: 1.5;
          transition: color 0.25s ease;
        }

        .mapText strong {
          font-weight: 800;
        }

        .infoBox {
          margin-top: 24px;
          padding: 22px 28px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
        }

        .infoBox div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .infoBox strong {
          font-size: 15px;
        }

        .infoBox span {
          font-size: 13px;
          line-height: 1.45;
          color: #64748b;
        }

        .right {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          align-content: start;
        }

        .right .card:last-child {
          grid-column: 1;
        }

        .card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
          cursor: pointer;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
        }

        .card:focus-visible {
          outline: 3px solid rgba(8, 145, 178, 0.25);
          outline-offset: 3px;
        }

        .card.selected {
          border: 2px solid #0891b2;
        }

        .cardImage {
          position: relative;
          height: 92px;
          background-position: center;
          background-size: cover;
        }

        .sokcho {
          background-image: url("/images/regions/sokcho-card.jpg");
          background-size: cover;
          background-position: center;
        }

        .yangyang {
          background-image: url("/images/regions/yangyang-card.jpg");
          background-size: cover;
          background-position: center;
        }

        .gangneung {
          background-image: url("/images/regions/gangneung-card.jpg");
          background-size: cover;
          background-position: center;        }

        .donghae {
          background-image: url("/images/regions/donghae-card.jpg");
          background-size: cover;
          background-position: center;        }

        .samcheok {
          background-image: url("/images/regions/samcheok-card.jpg");
          background-size: cover;
          background-position: center;        }

        .check {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #0f999b;
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
        }

        .cardBody {
          padding: 13px 14px 14px;
        }

        .cardTitleRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .card h2 {
          margin: 0;
          overflow: hidden;
          font-size: 24px;
          letter-spacing: -0.6px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cardTitleRow > span {
          flex-shrink: 0;
          font-size: 26px;
          line-height: 1;
        }

        .tags {
          min-height: 48px;
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          gap: 8px;
        }

        .tags span {
          padding: 5px 8px;
          border-radius: 999px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .selected .tags span {
          background: #ccfbf1;
          color: #0f766e;
        }

        .startButton {
          width: 100%;
          height: 40px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
          border: none;
          border-radius: 9px;
          background: #04979b;
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .startButton:hover {
          background: #03878b;
        }

        .footer {
          min-height: 60px;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #e5e7eb;
          background: #ffffff;
          color: #64748b;
          font-size: 13px;
          box-sizing: border-box;
        }

        .footer div {
          display: flex;
          gap: 28px;
        }

        .footer p {
          margin: 0;
        }

        @media (max-width: 1180px) {
          .main {
            grid-template-columns: 1fr;
          }

          .right {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .mapBox {
            max-width: 760px;
          }
        }

        @media (max-width: 980px) and (min-width: 721px) {
          .right {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .header {
            padding: 0 20px;
          }

          .nav {
            display: none;
          }

          .main {
            padding: 32px 20px;
          }

          h1 {
            font-size: 32px;
          }

          .subtitle br {
            display: none;
          }

          .mapBox {
            height: 430px;
          }

          .timeController {
            top: 4px;
            width: calc(100% - 28px);
            padding: 9px 13px 11px;
          }

          .mapLabel {
            min-width: 63px;
            height: 32px;
            padding: 0 10px;
            border-radius: 11px;
            font-size: 11px;
          }

          .sokchoMarker {
            top: 21%;
            left: 27%;
          }

          .yangyangMarker {
            top: 35%;
            left: 33%;
          }

          .gangneungMarker {
            top: 54%;
            left: 43%;
          }

          .donghaeMarker {
            top: 67%;
            left: 49%;
          }

          .samcheokMarker {
            top: 80%;
            left: 55%;
          }

          .regionPreview {
            top: calc(100% + 8px);
            left: 0;
            width: 176px;
            transform: none;
          }

          .donghaeMarker .regionPreview,
          .samcheokMarker .regionPreview {
            top: auto;
            bottom: calc(100% + 8px);
          }

          @keyframes previewAppear {
            from {
              opacity: 0;
              transform: translateY(-6px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .sunObject {
            top: 72px;
            right: 22px;
            width: 42px;
            height: 42px;
          }

          .moonObject {
            top: 69px;
            right: 24px;
            font-size: 49px;
          }

          .boat1 {
            left: 72%;
            font-size: 26px;
          }

          .boat2 {
            left: 84%;
            font-size: 31px;
          }

          .boat3 {
            left: 80%;
            font-size: 24px;
          }

          .right {
            grid-template-columns: 1fr;
          }

          .right .card:last-child {
            grid-column: auto;
          }

          .infoBox {
            grid-template-columns: 1fr;
          }

          .tags {
            min-height: auto;
          }

          .footer {
            padding: 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .footer div {
            flex-wrap: wrap;
            gap: 12px 20px;
          }
        }
      `}</style>
    </div>
  );
}