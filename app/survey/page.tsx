import { Suspense } from "react";

import { SurveyStepper } from "@/components/survey/SurveyStepper";

export default function SurveyPage() {
  return (
    <Suspense>
      <SurveyStepper />
    </Suspense>
  );
}