"use client";

import { MantineProvider } from "@mantine/core";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthProvider } from "../src/context/AuthContext";
import { DrawStatusProvider } from "../src/context/DrawStatusContext";
import { AppLayout } from "../src/components/layout/AppLayout";
import { ProtectedPage } from "../src/components/layout/ProtectedPage";
import { theme } from "../src/theme";

function AppContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedPage>
      <DrawStatusProvider>
        <AppLayout>{children}</AppLayout>
      </DrawStatusProvider>
    </ProtectedPage>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AuthProvider>
        <AppContent>{children}</AppContent>
      </AuthProvider>
    </MantineProvider>
  );
}
