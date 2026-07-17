import type { Place } from "@/types/place";
import type { RegionId } from "@/types/survey";
import type { NormalizedPlace } from "@/lib/tourapi/normalize";

function getCategoryFromContentType(contentTypeId: string): Place["category"] {
  switch (contentTypeId) {
    case "39":
      return "food";
    case "28":
      return "leports";
    case "32":
      return "tour";
    case "12":
    default:
      return "tour";
  }
}

function getTagsFromTourPlace(place: NormalizedPlace): string[] {
  const tags = new Set<string>();

  if (place.contentTypeId === "12") {
    tags.add("#관광지");
  }

  if (place.contentTypeId === "28") {
    tags.add("#레포츠");
    tags.add("#액티비티");
  }

  if (place.contentTypeId === "32") {
    tags.add("#숙박");
  }

  if (place.contentTypeId === "39") {
    tags.add("#맛집");
    tags.add("#로컬");
  }

  if (place.address.includes("해변") || place.title.includes("해변")) {
    tags.add("#오션뷰");
    tags.add("#산책");
  }

  if (place.title.includes("공원") || place.address.includes("공원")) {
    tags.add("#자연");
    tags.add("#산책");
  }

  if (
    place.title.includes("시장") ||
    place.title.includes("항") ||
    place.address.includes("시장")
  ) {
    tags.add("#로컬");
  }

  if (
    place.title.includes("사") ||
    place.title.includes("문화") ||
    place.category.cat1 === "A02"
  ) {
    tags.add("#문화");
  }

  if (tags.size === 0) {
    tags.add("#여행");
  }

  return Array.from(tags);
}

export function mapTourPlaceToPlace(
  tourPlace: NormalizedPlace,
  options: {
    regionId: RegionId;
    isPetFriendly?: boolean;
  },
): Place {
  return {
    id: tourPlace.contentId,
    name: tourPlace.title,
    category: getCategoryFromContentType(tourPlace.contentTypeId),
    address: tourPlace.address,
    latitude: tourPlace.mapY ?? undefined,
    longitude: tourPlace.mapX ?? undefined,
    imageUrl: tourPlace.image ?? tourPlace.thumbnail ?? undefined,
    tags: getTagsFromTourPlace(tourPlace),
    isPetFriendly: options.isPetFriendly ?? false,
    contentId: tourPlace.contentId,
    contentTypeId: tourPlace.contentTypeId,
    overview: tourPlace.overview ?? undefined,
    tel: tourPlace.tel ?? undefined,
    source: "tourapi",
  };
}