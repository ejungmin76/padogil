"use client";

import Image from "next/image";
import type { Place } from "@/types/place";

type PlaceTimelineProps = {
  places: Place[];
};

function getCategoryLabel(category: Place["category"]) {
  if (category === "food") return "맛집";
  if (category === "stay") return "숙소";
  if (category === "leports") return "액티비티";

  return "관광";
}

function getPetLabel(isPetFriendly: boolean | undefined) {
  if (isPetFriendly === true) {
    return "반려동물 동반 가능";
  }

  if (isPetFriendly === false) {
    return "반려동물 동반 불가";
  }

  return "반려동물 정보 없음";
}

export default function PlaceTimeline({
  places,
}: PlaceTimelineProps) {
  if (places.length === 0) {
    return (
      <section className="emptyState">
        <h2>등록된 방문 장소가 없어요</h2>
        <p>코스 장소 정보가 준비되면 이곳에 표시됩니다.</p>

        <style jsx>{`
          .emptyState {
            padding: 48px 24px;
            border: 1px dashed #cbd5e1;
            border-radius: 18px;
            background: #ffffff;
            text-align: center;
          }

          .emptyState h2 {
            margin: 0;
            color: #111827;
            font-size: 20px;
          }

          .emptyState p {
            margin: 10px 0 0;
            color: #64748b;
            font-size: 13px;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="timelineSection">
      <div className="sectionHeading">
        <div>
          <span>TRAVEL COURSE</span>
          <h2>방문 순서</h2>
        </div>

        <p>{places.length}개의 장소를 순서대로 둘러보세요.</p>
      </div>

      <ol className="timelineList">
        {places.map((place, index) => (
          <li key={place.id} className="timelineItem">
            <div className="timelineRail">
              <span className="orderNumber">{index + 1}</span>
            </div>

            <article className="placeCard">
              <div className="imageWrap">
                {place.imageUrl ? (
                  <Image
                    src={place.imageUrl}
                    alt={`${place.name} 사진`}
                    fill
                    sizes="(max-width: 760px) 110px, 180px"
                    className="placeImage"
                  />
                ) : (
                  <div className="imageFallback">
                    사진 준비 중
                  </div>
                )}
              </div>

              <div className="placeContent">
                <div className="titleRow">
                  <div>
                    <span className="categoryBadge">
                      {getCategoryLabel(place.category)}
                    </span>

                    <h3>{place.name}</h3>
                  </div>

                  {place.isPetFriendly === true && (
                    <span className="petBadge">
                      🐾 반려동물 가능
                    </span>
                  )}
                </div>

                <p className="address">
                  <span aria-hidden="true">⌖</span>
                  {place.address || "주소 정보 없음"}
                </p>

                <div className="infoRow">
                  <span>
                    {getPetLabel(place.isPetFriendly)}
                  </span>

                  {place.parking && (
                    <span>주차: {place.parking}</span>
                  )}

                  {place.openTime && (
                    <span>운영: {place.openTime}</span>
                  )}
                </div>
              </div>
            </article>

            {index < places.length - 1 && (
              <div className="moveInfo">
                <span aria-hidden="true">↓</span>
                <strong>다음 장소로 이동</strong>
              </div>
            )}
          </li>
        ))}
      </ol>

      <style jsx>{`
        .timelineSection {
          margin-top: 24px;
        }

        .sectionHeading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .sectionHeading span {
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .sectionHeading h2 {
          margin: 5px 0 0;
          color: #111827;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .sectionHeading p {
          margin: 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .timelineList {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .timelineItem {
          position: relative;
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: 12px;
        }

        .timelineRail {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .timelineRail::after {
          content: "";
          position: absolute;
          top: 38px;
          bottom: -32px;
          width: 2px;
          background: #bfdbfe;
        }

        .timelineItem:last-child .timelineRail::after {
          display: none;
        }

        .orderNumber {
          position: relative;
          z-index: 2;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 3px solid #ffffff;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
        }

        .placeCard {
          min-width: 0;
          padding: 12px;
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr);
          gap: 18px;
          border: 1px solid #dbe3ed;
          border-radius: 17px;
          background: #ffffff;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
        }

        .imageWrap {
          position: relative;
          height: 122px;
          overflow: hidden;
          border-radius: 12px;
          background: #e2e8f0;
        }

        .placeImage {
          object-fit: cover;
        }

        .imageFallback {
          height: 100%;
          display: grid;
          place-items: center;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
        }

        .placeContent {
          min-width: 0;
          padding: 5px 4px;
        }

        .titleRow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .categoryBadge {
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
        }

        .titleRow h3 {
          margin: 5px 0 0;
          color: #111827;
          font-size: 22x;
          font-weight: 900;
          letter-spacing: -0.6px;
        }

        .petBadge {
          flex-shrink: 0;
          padding: 6px 9px;
          border: 1px solid #a7f3d0;
          border-radius: 999px;
          background: #ecfdf5;
          color: #0f766e;
          font-size: 10px;
          font-weight: 900;
        }

        .address {
          margin: 13px 0 0;
          display: flex;
          align-items: flex-start;
          gap: 7px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        .address span {
          flex-shrink: 0;
          color: #94a3b8;
        }

        .infoRow {
          margin-top: 13px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .infoRow span {
          padding: 5px 8px;
          border-radius: 7px;
          background: #f1f5f9;
          color: #475569;
          font-size: 9px;
          font-weight: 700;
        }

        .moveInfo {
          grid-column: 2;
          min-height: 36px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 10px;
        }

        .moveInfo span {
          color: #2563eb;
          font-size: 18px;
        }

        @media (max-width: 760px) {
          .sectionHeading {
            align-items: flex-start;
            flex-direction: column;
          }

          .timelineItem {
            grid-template-columns: 34px minmax(0, 1fr);
            gap: 9px;
          }

          .placeCard {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 12px;
          }

          .imageWrap {
            height: 110px;
          }

          .titleRow {
            flex-direction: column;
          }

          .petBadge {
            display: none;
          }

          .titleRow h3 {
            font-size: 16px;
          }

          .infoRow {
            display: none;
          }
        }
      `}</style>
    </section>
  );

  
}