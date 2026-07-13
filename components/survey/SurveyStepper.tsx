"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SurveyOptionCard } from "@/components/survey/SurveyOptionCard";
import type {
  AgeGroup,
  PartyType,
  PetType,
  RegionId,
  SurveyResponse,
  TransportType,
} from "@/types/survey";



type DraftSurvey = Partial<Omit<SurveyResponse, "regionId">> & {
  regionId: RegionId;
};

type SurveyOption<T extends string> = {
  value: T;
  label: string;
  description: string;
};

type SurveyStep =
  | {
      key: "partyType";
      stepLabel: string;
      title: string;
      description: string;
      options: SurveyOption<PartyType>[];
    }
  | {
      key: "transportType";
      stepLabel: string;
      title: string;
      description: string;
      options: SurveyOption<TransportType>[];
    }
  | {
      key: "petType";
      stepLabel: string;
      title: string;
      description: string;
      options: SurveyOption<PetType>[];
    }
  | {
      key: "ageGroup";
      stepLabel: string;
      title: string;
      description: string;
      options: SurveyOption<AgeGroup>[];
    };

const REGION_IDS: RegionId[] = [
  "gangneung",
  "sokcho",
  "yangyang",
  "donghae",
  "samcheok",
];

const regionLabels: Record<RegionId, string> = {
  gangneung: "강릉",
  sokcho: "속초",
  yangyang: "양양",
  donghae: "동해",
  samcheok: "삼척",
};

const steps: SurveyStep[] = [
  {
    key: "partyType",
    stepLabel: "동반 인원",
    title: "누구와 함께 여행하시나요?",
    description: "여행 인원에 맞춰 코스 분위기와 동선을 조정해드릴게요.",
    options: [
      {
        value: "solo",
        label: "혼자",
        description: "혼자 조용히 즐기는 여행이에요.",
      },
      {
        value: "couple",
        label: "2인/커플",
        description: "둘이 함께 여유롭게 다니는 여행이에요.",
      },
      {
        value: "family",
        label: "가족",
        description: "가족과 편하게 움직이는 여행이에요.",
      },
      {
        value: "group",
        label: "단체",
        description: "여러 명이 함께 즐기는 여행이에요.",
      },
    ],
  },
  {
    key: "transportType",
    stepLabel: "이동수단",
    title: "어떤 이동수단으로 여행하시나요?",
    description: "이동 방식에 따라 접근성과 동선을 다르게 추천해드릴게요.",
    options: [
      {
        value: "car",
        label: "자차",
        description: "개인 차량으로 이동할 예정이에요.",
      },
      {
        value: "public",
        label: "대중교통",
        description: "버스나 기차를 이용할 예정이에요.",
      },
      {
        value: "rental",
        label: "렌터카",
        description: "현지에서 차량을 빌려 이동할 예정이에요.",
      },
    ],
  },
  {
    key: "petType",
    stepLabel: "반려동물",
    title: "반려동물과 함께하시나요?",
    description: "동반 여부에 따라 산책과 입장 가능 장소를 고려할게요.",
    options: [
      {
        value: "none",
        label: "동반 안 함",
        description: "반려동물 없이 여행해요.",
      },
      {
        value: "small",
        label: "소형견 동반",
        description: "작은 반려동물과 함께해요.",
      },
      {
        value: "large",
        label: "중대형견 동반",
        description: "큰 반려동물과 함께해요.",
      },
    ],
  },
  {
    key: "ageGroup",
    stepLabel: "여행 테마",
    title: "어떤 여행 분위기를 원하시나요?",
    description: "연령대 대신 선호 테마로 추천 방향을 맞출게요.",
    options: [
      {
        value: "teens-twenties",
        label: "액티비티/핫플",
        description: "활동적이고 사진 찍기 좋은 코스를 원해요.",
      },
      {
        value: "thirties",
        label: "맛집/카페",
        description: "로컬 맛집과 카페 중심으로 즐기고 싶어요.",
      },
      {
        value: "forties",
        label: "자연/문화",
        description: "자연과 문화 명소를 균형 있게 보고 싶어요.",
      },
      {
        value: "fifties-plus",
        label: "산책/여유",
        description: "무리 없는 동선으로 천천히 쉬고 싶어요.",
      },
    ],
  },
];

const selectedLabels = {
  partyType: {
    solo: "혼자",
    couple: "2인/커플",
    family: "가족",
    group: "단체",
  },
  transportType: {
    car: "자차",
    public: "대중교통",
    rental: "렌터카",
  },
  petType: {
    none: "동반 안 함",
    small: "소형견 동반",
    large: "중대형견 동반",
  },
  ageGroup: {
    "teens-twenties": "액티비티/핫플",
    thirties: "맛집/카페",
    forties: "자연/문화",
    "fifties-plus": "산책/여유",
  },
};

function isRegionId(value: string | null): value is RegionId {
  return !!value && REGION_IDS.includes(value as RegionId);
}

function isCompleteSurvey(value: DraftSurvey): value is SurveyResponse {
  return Boolean(
    value.regionId &&
      value.partyType &&
      value.transportType &&
      value.petType &&
      value.ageGroup,
  );
}

function getSelectedLabel(step: SurveyStep, survey: DraftSurvey) {
  switch (step.key) {
    case "partyType":
      return survey.partyType
        ? selectedLabels.partyType[survey.partyType]
        : "선택 전";
    case "transportType":
      return survey.transportType
        ? selectedLabels.transportType[survey.transportType]
        : "선택 전";
    case "petType":
      return survey.petType ? selectedLabels.petType[survey.petType] : "선택 전";
    case "ageGroup":
      return survey.ageGroup
        ? selectedLabels.ageGroup[survey.ageGroup]
        : "선택 전";
  }
}

export function SurveyStepper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRegionId = useMemo<RegionId>(() => {
    const region = searchParams.get("region");

    return isRegionId(region) ? region : "sokcho";
  }, [searchParams]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [survey, setSurvey] = useState<DraftSurvey>({
    regionId: initialRegionId,
  });

  const currentStep = steps[currentStepIndex];
  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  async function submitSurvey(nextSurvey: DraftSurvey) {
    if (!isCompleteSurvey(nextSurvey)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/course/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextSurvey),
      });

      const data = await response.json();

      sessionStorage.setItem("padogil-survey", JSON.stringify(nextSurvey));
      sessionStorage.setItem("padogil-courses", JSON.stringify(data));

      router.push("/courses");
    } catch {
      sessionStorage.setItem("padogil-survey", JSON.stringify(nextSurvey));
      router.push("/courses");
    }
  }

  function handleSelect(value: string) {
    if (isSubmitting) return;

    const nextSurvey = {
      ...survey,
      [currentStep.key]: value,
    } as DraftSurvey;

    setSurvey(nextSurvey);

    window.setTimeout(() => {
      const nextStepIndex = currentStepIndex + 1;

      if (nextStepIndex < steps.length) {
        setCurrentStepIndex(nextStepIndex);
        return;
      }

      submitSurvey(nextSurvey);
    }, 220);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      <header className="flex h-[72px] items-center justify-between border-b border-[#e5e7eb] bg-white px-5 md:px-12">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-[30px] font-black tracking-[-1px] text-[#0f3f78]"
        >
          PADOGIL
        </button>

        <nav
          className="hidden h-full gap-14 text-base font-semibold text-[#111827] md:flex"
          aria-label="주요 메뉴"
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-full items-center border-b-[3px] border-transparent"
          >
            권역 선택
          </button>

          <button
            type="button"
            onClick={() => router.push("/courses")}
            className="flex h-full items-center border-b-[3px] border-transparent"
          >
            추천 코스
          </button>

          <span className="flex h-full items-center border-b-[3px] border-transparent">
            태그 탐색
          </span>
        </nav>

        <div className="text-[28px]" aria-hidden="true">
          ♡
        </div>
      </header>

      <main className="px-5 py-8">
        <section className="mx-auto flex min-h-[calc(100vh-136px)] w-full max-w-6xl items-center">
          <div className="grid w-full gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  선택 지역
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
                  {regionLabels[survey.regionId]}
                </h1>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600">진행률</span>
                  <span className="font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <ol className="mt-8 space-y-3">
                {steps.map((step, index) => {
                  const active = index === currentStepIndex;
                  const completed = index < currentStepIndex;
                  const selectedLabel = getSelectedLabel(step, survey);

                  return (
                    <li key={step.key}>
                      <button
                        type="button"
                        disabled={index > currentStepIndex || isSubmitting}
                        onClick={() => setCurrentStepIndex(index)}
                        className={[
                          "w-full rounded-2xl border p-4 text-left transition",
                          active
                            ? "border-blue-200 bg-blue-50"
                            : "border-transparent bg-white hover:bg-slate-50",
                          index > currentStepIndex
                            ? "cursor-default opacity-55"
                            : "cursor-pointer",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={[
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                              completed
                                ? "bg-blue-600 text-white"
                                : active
                                  ? "bg-white text-blue-600 ring-1 ring-blue-200"
                                  : "bg-slate-100 text-slate-400",
                            ].join(" ")}
                          >
                            {completed ? "✓" : index + 1}
                          </span>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900">
                              {step.stepLabel}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {selectedLabel}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </aside>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="flex min-h-[620px] flex-col justify-center">
                <div>
                  <p className="text-sm font-bold text-blue-600">
                    {currentStepIndex + 1} / {steps.length}
                  </p>
                  <h2 className="mt-5 text-3xl font-black tracking-normal text-slate-950">
                    {currentStep.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-500">
                    {currentStep.description}
                  </p>
                </div>

                <div className="mt-10 grid auto-rows-[156px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {currentStep.options.map((option) => {
                    const selected = survey[currentStep.key] === option.value;

                    return (
                      <SurveyOptionCard
                        key={option.value}
                        label={option.label}
                        description={option.description}
                        value={option.value}
                        selected={selected}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </div>

                {isSubmitting && (
                  <p className="mt-8 text-center text-sm font-semibold text-blue-600">
                    맞춤 코스를 찾고 있어요
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}