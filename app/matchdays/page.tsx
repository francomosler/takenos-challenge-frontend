"use client";

import { Suspense } from "react";
import { MatchDaysPage } from "../../src/views/MatchDaysPage";

export default function Page() {
  return (
    <Suspense>
      <MatchDaysPage />
    </Suspense>
  );
}
