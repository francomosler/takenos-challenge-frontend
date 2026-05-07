"use client";

import { Suspense } from "react";
import { TeamsPage } from "../../src/views/TeamsPage";

export default function Page() {
  return (
    <Suspense>
      <TeamsPage />
    </Suspense>
  );
}
