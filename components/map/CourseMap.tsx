"use client";

import type { Place } from "@/types/place";

type CourseMapProps = {
  places: Place[];
};

export default function CourseMap({
  places,
}: CourseMapProps) {
  const placesWithCoordinates = places.filter(
    (place) =>
      typeof place.latitude === "number" &&
      typeof place.longitude === "number",
  );

  const hasMapKey = Boolean(
    process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,
  );

  const canShowMap =
    hasMapKey && placesWithCoordinates.length > 0;

  return (
    <section className="mapSection">
      <div className="sectionHeading">
        <div>
          <span>COURSE MAP</span>
          <h2>코스 지도</h2>
        </div>

        <p>
          방문 장소의 위치와 순서를 확인해 보세요.
        </p>
      </div>

      <div className="mapCard">
        {canShowMap ? (
          <div className="mapReady">
            <span className="mapIcon">⌖</span>
            <strong>지도 연결 준비 완료</strong>
            <p>
              좌표가 있는 장소가{" "}
              {placesWithCoordinates.length}개 있습니다.
            </p>

            <div className="markerPreview">
              {placesWithCoordinates.map(
                (place, index) => (
                  <div
                    key={place.id}
                    className="markerItem"
                  >
                    <span>{index + 1}</span>

                    <div>
                      <strong>{place.name}</strong>
                      <small>{place.address}</small>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="fallback">
            <span className="mapIcon">⌖</span>

            {!hasMapKey ? (
              <>
                <strong>지도를 준비하고 있어요</strong>
                <p>
                  지도 API 키가 연결되면 장소 위치를
                  지도에서 확인할 수 있습니다.
                </p>
              </>
            ) : (
              <>
                <strong>장소 좌표 정보가 부족해요</strong>
                <p>
                  좌표가 추가되면 방문 장소를 지도에
                  표시할 수 있습니다.
                </p>
              </>
            )}

            <div className="addressList">
              {places.map((place, index) => (
                <div
                  key={place.id}
                  className="addressItem"
                >
                  <span>{index + 1}</span>

                  <div>
                    <strong>{place.name}</strong>
                    <small>
                      {place.address || "주소 정보 없음"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .mapSection {
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
          color: #0f9f8f;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .sectionHeading h2 {
          margin: 5px 0 0;
          color: #111827;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.6px;
        }

        .sectionHeading p {
          margin: 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .mapCard {
          min-height: 420px;
          overflow: hidden;
          border: 1px solid #dbe3ed;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 8px 22px
            rgba(15, 23, 42, 0.05);
        }

        .fallback,
        .mapReady {
          min-height: 420px;
          padding: 34px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at 35% 30%,
              #ffffff,
              #f8fafc 52%,
              #ecfeff
            );
          text-align: center;
        }

        .mapIcon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 30px;
          box-shadow: 0 10px 24px
            rgba(37, 99, 235, 0.22);
        }

        .fallback > strong,
        .mapReady > strong {
          margin-top: 18px;
          color: #111827;
          font-size: 19px;
        }

        .fallback > p,
        .mapReady > p {
          max-width: 420px;
          margin: 10px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .addressList,
        .markerPreview {
          width: 100%;
          max-width: 520px;
          margin-top: 26px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }

        .addressItem,
        .markerItem {
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #dbe3ed;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.9);
        }

        .addressItem > span,
        .markerItem > span {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
        }

        .addressItem div,
        .markerItem div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .addressItem strong,
        .markerItem strong {
          color: #334155;
          font-size: 12px;
        }

        .addressItem small,
        .markerItem small {
          overflow: hidden;
          color: #94a3b8;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 760px) {
          .sectionHeading {
            align-items: flex-start;
            flex-direction: column;
          }

          .mapCard,
          .fallback,
          .mapReady {
            min-height: 360px;
          }

          .fallback,
          .mapReady {
            padding: 24px 18px;
          }
        }
      `}</style>
    </section>
  );
}