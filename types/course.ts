import type { Place } from "./place";
import type { RegionId } from "./survey";

export type Course = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  places: Place[];
  estimatedStyle?: string;
  isPetFriendly?: boolean;
  transportNote?: string;

  regionId?: RegionId;
  mainImageUrl?: string;
  durationLabel?: string;
  recommendedReason?: string;
};