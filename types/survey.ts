export type RegionId = "gangneung" | "sokcho" | "yangyang" | "donghae" | "samcheok";

export type PartyType = "solo" | "couple" | "family" | "group";

export type TransportType = "car" | "public" | "rental";

export type PetType = "none" | "small" | "large";

export type AgeGroup = "teens-twenties" | "thirties" | "forties" | "fifties-plus";

export type SurveyResponse = {
  regionId: RegionId;
  partyType: PartyType;
  transportType: TransportType;
  petType: PetType;
  ageGroup: AgeGroup;
};