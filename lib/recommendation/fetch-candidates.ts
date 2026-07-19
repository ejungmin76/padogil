import type { Place } from "@/types/place";
import type { RegionId, SurveyResponse } from "@/types/survey";
import { requestTourApi } from "@/lib/tourapi/client";
import { TOUR_CONTENT_TYPES } from "@/lib/tourapi/content-types";
import { GANGWON_EAST_COAST_REGIONS } from "@/lib/tourapi/regions";
import {
  normalizeTourPlaces,
  type TourApiRawItem,
} from "@/lib/tourapi/normalize";
import { mapTourPlaceToPlace } from "./map-tour-place";

export type RecommendationCandidates = {
  coursePlaces: Place[];
  accommodations: Place[];
  source: "tourapi" | "fallback";
};

const MIN_COURSE_CANDIDATE_COUNT = 5;

function getTourRegion(regionId: RegionId) {
  if (regionId in GANGWON_EAST_COAST_REGIONS) {
    return GANGWON_EAST_COAST_REGIONS[
      regionId as keyof typeof GANGWON_EAST_COAST_REGIONS
    ];
  }

  return null;
}

async function fetchTourPlacesByContentType(params: {
  regionId: RegionId;
  contentTypeId: string;
  numOfRows?: number;
}) {
  const region = getTourRegion(params.regionId);

  if (!region) {
    return [];
  }

  const result = await requestTourApi<TourApiRawItem>("areaBasedList2", {
    areaCode: region.areaCode,
    sigunguCode: region.sigunguCode,
    contentTypeId: params.contentTypeId,
    pageNo: 1,
    numOfRows: params.numOfRows ?? 12,
    arrange: "Q",
  });

  if (!result.ok) {
    return [];
  }

  return normalizeTourPlaces(result.items);
}

async function fetchPetFriendlyContentIds(params: {
  regionId: RegionId;
}): Promise<Set<string>> {
  const region = getTourRegion(params.regionId);

  if (!region) {
    return new Set();
  }

  const result = await requestTourApi<TourApiRawItem>(
    "areaBasedList2",
    {
      areaCode: region.areaCode,
      sigunguCode: region.sigunguCode,
      pageNo: 1,
      numOfRows: 50,
      arrange: "Q",
    },
    {
      service: "pet",
    },
  );

  if (!result.ok) {
    return new Set();
  }

  const petPlaces = normalizeTourPlaces(result.items);

  return new Set(petPlaces.map((place) => place.contentId));
}

export async function fetchRecommendationCandidates(
  survey: SurveyResponse,
): Promise<RecommendationCandidates> {
  try {
    const shouldUsePetApi = survey.petType !== "none";

    const [tourPlaces, foodPlaces, leportsPlaces, accommodationPlaces, petIds] =
      await Promise.all([
        fetchTourPlacesByContentType({
          regionId: survey.regionId,
          contentTypeId: TOUR_CONTENT_TYPES.attraction,
        }),
        fetchTourPlacesByContentType({
          regionId: survey.regionId,
          contentTypeId: TOUR_CONTENT_TYPES.food,
        }),
        fetchTourPlacesByContentType({
          regionId: survey.regionId,
          contentTypeId: TOUR_CONTENT_TYPES.leports,
        }),
        fetchTourPlacesByContentType({
          regionId: survey.regionId,
          contentTypeId: TOUR_CONTENT_TYPES.accommodation,
          numOfRows: 8,
        }),
        shouldUsePetApi
          ? fetchPetFriendlyContentIds({
              regionId: survey.regionId,
            })
          : Promise.resolve(new Set<string>()),
      ]);

    const courseTourPlaces = [
      ...tourPlaces,
      ...foodPlaces,
      ...leportsPlaces,
    ];

    const coursePlaces = courseTourPlaces.map((place) => {
      return mapTourPlaceToPlace(place, {
        regionId: survey.regionId,
        isPetFriendly: petIds.has(place.contentId),
      });
    });

    const accommodations = accommodationPlaces.map((place) => {
      return mapTourPlaceToPlace(place, {
        regionId: survey.regionId,
        isPetFriendly: petIds.has(place.contentId),
      });
    });

    if (coursePlaces.length < MIN_COURSE_CANDIDATE_COUNT) {
      return {
        coursePlaces: [],
        accommodations,
        source: "fallback",
      };
    }

    return {
      coursePlaces,
      accommodations,
      source: "tourapi",
    };
  } catch {
    return {
      coursePlaces: [],
      accommodations: [],
      source: "fallback",
    };
  }
}