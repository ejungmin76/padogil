import type { Place } from "./place";

export type Course = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  places: Place[];
  estimatedStyle?: string;
  isPetFriendly?: boolean;
  transportNote?: string;
};