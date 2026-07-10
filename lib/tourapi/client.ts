type TourApiParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type TourApiSuccess<T = unknown> = {
  ok: true;
  items: T[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
  raw: unknown;
};

export type TourApiFailure = {
  ok: false;
  status: number;
  message: string;
  code?: string;
  raw?: unknown;
};

export type TourApiResult<T = unknown> = TourApiSuccess<T> | TourApiFailure;

const TOUR_API_BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

function getTourApiKey(): string | null {
  const key = process.env.TOUR_API_KEY;

  if (!key) return null;

  try {
    return decodeURIComponent(key.trim());
  } catch {
    return key.trim();
  }
}

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function requestTourApi<T = unknown>(
  endpoint: string,
  params: TourApiParams = {},
): Promise<TourApiResult<T>> {
  const serviceKey = getTourApiKey();

  if (!serviceKey) {
    return {
      ok: false,
      status: 500,
      message: "TOUR_API_KEY 환경 변수가 설정되어 있지 않습니다.",
    };
  }

  const url = new URL(`${TOUR_API_BASE_URL}/${endpoint.replace(/^\//, "")}`);

  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("MobileOS", "ETC");
  url.searchParams.set("MobileApp", "padogil");
  url.searchParams.set("_type", "json");

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const text = await response.text();

    let data: any;

   try {
  data = JSON.parse(text);
} catch {
  console.error("관광공사 API 원본 응답:", text);

  return {
    ok: false,
    status: response.status,
    message: "관광공사 API 응답이 JSON 형식이 아닙니다.",
    raw: text.slice(0, 500),
  };
}

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "관광공사 API 요청에 실패했습니다.",
        raw: data,
      };
    }

    const header = data?.response?.header;
    const body = data?.response?.body;

    if (header?.resultCode && header.resultCode !== "0000") {
      return {
        ok: false,
        status: 502,
        code: String(header.resultCode),
        message: String(header.resultMsg ?? "관광공사 API 오류입니다."),
        raw: data,
      };
    }

    const rawItems = body?.items?.item;
    const items = toArray<T>(rawItems);

    return {
      ok: true,
      items,
      totalCount: Number(body?.totalCount ?? items.length),
      pageNo: Number(body?.pageNo ?? params.pageNo ?? 1),
      numOfRows: Number(body?.numOfRows ?? params.numOfRows ?? items.length),
      raw: data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message:
        error instanceof Error
          ? error.message
          : "관광공사 API 요청 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}