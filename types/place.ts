export type PlaceCategory = "tour" | "food" | "stay" | "leports";

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
};