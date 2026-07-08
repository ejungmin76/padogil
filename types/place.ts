export type PlaceCategory = "tour" | "food" | "stay" | "leports";

export type PlaceSource = "tourapi" | "sample";

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  tags: string[];
  isPetFriendly?: boolean;

  contentId?: string;
  contentTypeId?: string;
  overview?: string;
  tel?: string;
  homepage?: string;
  parking?: string;
  openTime?: string;
  source?: PlaceSource;
};