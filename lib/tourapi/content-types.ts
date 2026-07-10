export const TOUR_CONTENT_TYPES = {
  attraction: "12", // 관광지
  leports: "28", // 레포츠
  accommodation: "32", // 숙박
  food: "39", // 음식점
} as const;

export type TourContentTypeKey = keyof typeof TOUR_CONTENT_TYPES;
export type TourContentTypeId =
  (typeof TOUR_CONTENT_TYPES)[TourContentTypeKey];

export function isTourContentTypeId(value: string): value is TourContentTypeId {
  return Object.values(TOUR_CONTENT_TYPES).includes(value as TourContentTypeId);
}