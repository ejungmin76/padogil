import { NextRequest, NextResponse } from "next/server";

import { requestTourApi } from "@/lib/tourapi/client";

export const runtime = "nodejs";

type TourSearchItem = {
  contentid?: string;
  contenttypeid?: string;
  title?: string;
  addr1?: string;
  addr2?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  tel?: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const areaCode = searchParams.get("areaCode") ?? "32"; // 강원
  const sigunguCode = searchParams.get("sigunguCode") ?? "";
  const contentTypeId = searchParams.get("contentTypeId") ?? "12"; // 관광지
  const pageNo = Number(searchParams.get("pageNo") ?? 1);
  const numOfRows = Number(searchParams.get("numOfRows") ?? 10);

  if (Number.isNaN(pageNo) || pageNo < 1) {
    return NextResponse.json(
      {
        ok: false,
        message: "pageNo는 1 이상의 숫자여야 합니다.",
      },
      { status: 400 },
    );
  }

  if (Number.isNaN(numOfRows) || numOfRows < 1 || numOfRows > 100) {
    return NextResponse.json(
      {
        ok: false,
        message: "numOfRows는 1 이상 100 이하의 숫자여야 합니다.",
      },
      { status: 400 },
    );
  }

  const result = await requestTourApi<TourSearchItem>("areaBasedList2", {
    areaCode,
    sigunguCode,
    contentTypeId,
    pageNo,
    numOfRows,
    arrange: "Q",
  });
if (!result.ok) {
  return NextResponse.json(
    {
      ok: false,
      message: result.message,
      code: result.code,
      raw: result.raw,
    },
    { status: result.status },
  );
}
 
  return NextResponse.json({
    ok: true,
    data: result.items,
    meta: {
      totalCount: result.totalCount,
      pageNo: result.pageNo,
      numOfRows: result.numOfRows,
    },
  });
}