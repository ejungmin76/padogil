import { NextResponse } from "next/server";
import { buildRecommendedCourses } from "@/lib/recommendation/build-course";
import { fetchRecommendationCandidates } from "@/lib/recommendation/fetch-candidates";
import type {
  AgeGroup,
  PartyType,
  PetType,
  RegionId,
  SurveyResponse,
  TransportType,
} from "@/types/survey";

const REGION_IDS = [
  "gangneung",
  "sokcho",
  "yangyang",
  "donghae",
  "samcheok",
] satisfies RegionId[];

const PARTY_TYPES = ["solo", "couple", "family", "group"] satisfies PartyType[];
const TRANSPORT_TYPES = ["car", "public", "rental"] satisfies TransportType[];
const PET_TYPES = ["none", "small", "large"] satisfies PetType[];
const AGE_GROUPS = [
  "teens-twenties",
  "thirties",
  "forties",
  "fifties-plus",
] satisfies AgeGroup[];

function isStringIncluded<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function isSurveyResponse(value: unknown): value is SurveyResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    isStringIncluded(REGION_IDS, body.regionId) &&
    isStringIncluded(PARTY_TYPES, body.partyType) &&
    isStringIncluded(TRANSPORT_TYPES, body.transportType) &&
    isStringIncluded(PET_TYPES, body.petType) &&
    isStringIncluded(AGE_GROUPS, body.ageGroup)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSurveyResponse(body)) {
      return NextResponse.json({ courses: [] }, { status: 400 });
    }

    const candidates = await fetchRecommendationCandidates(body);

    const courses = buildRecommendedCourses(
      body,
      candidates.coursePlaces,
    );

    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json({ courses: [] }, { status: 500 });
  }
}