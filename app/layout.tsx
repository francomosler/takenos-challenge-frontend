import "@mantine/core/styles.css";

import { Suspense } from "react";
import type { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Champions League Draw",
  description: "Sorteo de la Champions League - formato liga suiza",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
