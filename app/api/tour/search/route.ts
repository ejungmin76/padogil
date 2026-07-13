import { NextRequest, NextResponse } from "next/server";

import { isTourContentTypeId, TOUR_CONTENT_TYPES } from "@/lib/tourapi/content-types";
import { requestTourApi } from "@/lib/tourapi/client";
import { getGangwonEastCoastRegions, type TourRegion } from "@/lib/tourapi/regions";
import {
  normalizeTourPlaces,
  type TourApiRawItem,
} from "@/lib/tourapi/normalize";

export const runtime = "nodejs";

function createErrorResponse(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      ok: false,
      message,
      ...extra,
    },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const directAreaCode = searchParams.get("areaCode");
  const directSigunguCode = searchParams.get("sigunguCode");

  const region = searchParams.get("region") ?? "east-coast";
  const contentTypeId =
    searchParams.get("contentTypeId") ?? TOUR_CONTENT_TYPES.attraction;

  const pageNo = Number(searchParams.get("pageNo") ?? 1);
  const numOfRows = Number(searchParams.get("numOfRows") ?? 12);

  if (!isTourContentTypeId(contentTypeId)) {
    return createErrorResponse("지원하지 않는 contentTypeId입니다.", 400, {
      allowedContentTypeIds: Object.values(TOUR_CONTENT_TYPES),
    });
  }

  if (Number.isNaN(pageNo) || pageNo < 1) {
    return createErrorResponse("pageNo는 1 이상의 숫자여야 합니다.", 400);
  }

  if (Number.isNaN(numOfRows) || numOfRows < 1 || numOfRows > 100) {
    return createErrorResponse(
      "numOfRows는 1 이상 100 이하의 숫자여야 합니다.",
      400,
    );
  }

  let targetRegions: TourRegion[] | null;

  if (directAreaCode) {
    targetRegions = [
      {
        label: "직접 지정 권역",
        areaCode: directAreaCode,
        sigunguCode: directSigunguCode ?? undefined,
      },
    ];
  } else {
    targetRegions = getGangwonEastCoastRegions(region);
  }

  if (!targetRegions) {
    return createErrorResponse("지원하지 않는 권역입니다.", 400, {
      allowedRegions: [
        "east-coast",
        "all",
        "gangneung",
        "goseong",
        "donghae",
        "samcheok",
        "sokcho",
        "yangyang",
      ],
    });
  }

  const results = await Promise.all(
    targetRegions.map((targetRegion) =>
      requestTourApi<TourApiRawItem>("areaBasedList2", {
        areaCode: targetRegion.areaCode,
        sigunguCode: targetRegion.sigunguCode,
        contentTypeId,
        pageNo,
        numOfRows,
        arrange: "Q",
      }),
    ),
  );

  const failedResult = results.find((result) => !result.ok);

  if (failedResult && !failedResult.ok) {
    return createErrorResponse(failedResult.message, failedResult.status, {
      code: failedResult.code,
    });
  }

  const rawItems = results.flatMap((result) =>
    result.ok ? result.items : [],
  );

  const places = normalizeTourPlaces(rawItems);

  return NextResponse.json({
    ok: true,
    data: places,
    meta: {
      region: directAreaCode ? "custom" : region,
      areaCode: directAreaCode ?? undefined,
      sigunguCode: directSigunguCode ?? undefined,
      contentTypeId,
      pageNo,
      numOfRows,
      count: places.length,
    },
  });
}