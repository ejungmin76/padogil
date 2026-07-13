import { NextRequest, NextResponse } from "next/server";

import { requestTourApi } from "@/lib/tourapi/client";
import {
  normalizeTourPlace,
  type TourApiRawItem,
} from "@/lib/tourapi/normalize";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const contentId =
    searchParams.get("contentId") ?? searchParams.get("contentid");

  if (!contentId) {
    return NextResponse.json(
      {
        ok: false,
        message: "contentId가 필요합니다.",
      },
      { status: 400 },
    );
  }

  const result = await requestTourApi<TourApiRawItem>("detailCommon2", {
    contentId,
    defaultYN: "Y",
    firstImageYN: "Y",
    areacodeYN: "Y",
    catcodeYN: "Y",
    addrinfoYN: "Y",
    mapinfoYN: "Y",
    overviewYN: "Y",
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: result.message,
        code: result.code,
      },
      { status: result.status },
    );
  }

  const item = result.items[0];

  if (!item) {
    return NextResponse.json({
      ok: true,
      data: null,
      message: "상세 정보가 없습니다.",
    });
  }

  return NextResponse.json({
    ok: true,
    data: normalizeTourPlace(item),
  });
}