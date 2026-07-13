export type TourApiRawItem = Record<string, unknown> & {
  contentid?: string | number;
  contenttypeid?: string | number;
  title?: string;
  addr1?: string;
  addr2?: string;
  zipcode?: string;
  tel?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string | number;
  mapy?: string | number;
  areacode?: string | number;
  sigungucode?: string | number;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  overview?: string;
};

export type NormalizedPlace = {
  id: string;
  contentId: string;
  contentTypeId: string;
  title: string;
  address: string;
  image: string | null;
  thumbnail: string | null;
  tel: string | null;
  mapX: number | null;
  mapY: number | null;
  areaCode: string | null;
  sigunguCode: string | null;
  category: {
    cat1: string | null;
    cat2: string | null;
    cat3: string | null;
  };
  overview: string | null;
  raw: TourApiRawItem;
};

function toNullableString(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  return String(value);
}

function toNullableNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

export function normalizeTourPlace(item: TourApiRawItem): NormalizedPlace {
  const contentId = String(item.contentid ?? "");

  return {
    id: contentId,
    contentId,
    contentTypeId: String(item.contenttypeid ?? ""),
    title: String(item.title ?? "제목 없음"),
    address: [item.addr1, item.addr2].filter(Boolean).join(" "),
    image: toNullableString(item.firstimage),
    thumbnail: toNullableString(item.firstimage2 ?? item.firstimage),
    tel: toNullableString(item.tel),
    mapX: toNullableNumber(item.mapx),
    mapY: toNullableNumber(item.mapy),
    areaCode: toNullableString(item.areacode),
    sigunguCode: toNullableString(item.sigungucode),
    category: {
      cat1: toNullableString(item.cat1),
      cat2: toNullableString(item.cat2),
      cat3: toNullableString(item.cat3),
    },
    overview: toNullableString(item.overview),
    raw: item,
  };
}

export function normalizeTourPlaces(items: TourApiRawItem[]) {
  const placeMap = new Map<string, NormalizedPlace>();

  items.forEach((item) => {
    const place = normalizeTourPlace(item);

    if (!place.contentId) return;

    placeMap.set(place.contentId, place);
  });

  return Array.from(placeMap.values());
}