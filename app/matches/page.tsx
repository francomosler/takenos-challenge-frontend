"use client";

import { Suspense } from "react";
import { MatchesPage } from "../../src/views/MatchesPage";

export default function Page() {
  return (
    <Suspense>
      <MatchesPage />
    </Suspense>
  );
}
