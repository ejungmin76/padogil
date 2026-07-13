import { NextRequest, NextResponse } from "next/server";

import { requestTourApi } from "@/lib/tourapi/client";
import { getGangwonEastCoastRegions, type TourRegion } from "@/lib/tourapi/regions";
import {
  normalizeTourPlace,
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

  const contentId =
    searchParams.get("contentId") ?? searchParams.get("contentid");

  if (contentId) {
    const detailResult = await requestTourApi<TourApiRawItem>(
      "detailPetTour2",
      {
        contentId,
      },
      {
        service: "pet",
      },
    );

    if (!detailResult.ok) {
      return createErrorResponse(detailResult.message, detailResult.status, {
        code: detailResult.code,
      });
    }

    const item = detailResult.items[0];

    return NextResponse.json({
      ok: true,
      data: item
        ? {
            ...normalizeTourPlace(item),
            petInfo: item,
          }
        : null,
    });
  }

  const directAreaCode = searchParams.get("areaCode");
  const directSigunguCode = searchParams.get("sigunguCode");

  const region = searchParams.get("region") ?? "east-coast";
  const pageNo = Number(searchParams.get("pageNo") ?? 1);
  const numOfRows = Number(searchParams.get("numOfRows") ?? 12);

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
    return createErrorResponse("지원하지 않는 권역입니다.", 400);
  }

  const results = await Promise.all(
    targetRegions.map((targetRegion) =>
      requestTourApi<TourApiRawItem>(
        "areaBasedList2",
        {
          areaCode: targetRegion.areaCode,
          sigunguCode: targetRegion.sigunguCode,
          pageNo,
          numOfRows,
          arrange: "Q",
        },
        {
          service: "pet",
        },
      ),
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

  return NextResponse.json({
    ok: true,
    data: normalizeTourPlaces(rawItems),
    meta: {
      region: directAreaCode ? "custom" : region,
      areaCode: directAreaCode ?? undefined,
      sigunguCode: directSigunguCode ?? undefined,
      pageNo,
      numOfRows,
    },
  });
}