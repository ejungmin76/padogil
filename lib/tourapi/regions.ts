export const GANGWON_AREA_CODE = "32";

export const GANGWON_EAST_COAST_REGIONS = {
  gangneung: {
    label: "강릉",
    areaCode: GANGWON_AREA_CODE,
    sigunguCode: "1",
  },
  goseong: {
    label: "고성",
    areaCode: GANGWON_AREA_CODE,
    sigunguCode: "2",
  },
  donghae: {
    label: "동해",
    areaCode: GANGWON_AREA_CODE,
    sigunguCode: "3",
  },
  samcheok: {
    label: "삼척",
    areaCode: GANGWON_AREA_CODE,
    sigunguCode: "4",
  },
  sokcho: {
    label: "속초",
    areaCode: GANGWON_AREA_CODE,
    sigunguCode: "5",
  },
  yangyang: {
    label: "양양",
    areaCode: GANGWON_AREA_CODE,
    sigunguCode: "7",
  },
} as const;

export type GangwonEastCoastRegionKey =
  keyof typeof GANGWON_EAST_COAST_REGIONS;

export type TourRegion = {
  label: string;
  areaCode: string;
  sigunguCode?: string;
};

export function isGangwonEastCoastRegionKey(
  value: string,
): value is GangwonEastCoastRegionKey {
  return value in GANGWON_EAST_COAST_REGIONS;
}

export function getGangwonEastCoastRegions(
  region?: string | null,
): TourRegion[] | null {
  if (!region || region === "all" || region === "east-coast") {
    return Object.values(GANGWON_EAST_COAST_REGIONS);
  }

  if (!isGangwonEastCoastRegionKey(region)) {
    return null;
  }

  return [GANGWON_EAST_COAST_REGIONS[region]];
}