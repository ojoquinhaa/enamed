import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://enamed.thejohn.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ENAMED 2025 | Painel de Medicina",
    template: "%s | ENAMED 2025",
  },
  description:
    "Analise visual do ENAMED 2025 para cursos de medicina, com rankings, mapas e indicadores.",
  applicationName: "ENAMED 2025",
  authors: [{ name: "TheJohn", url: "https://thejohn.com.br/pt" }],
  creator: "TheJohn",
  publisher: "TheJohn",
  keywords: [
    "ENAMED",
    "ENADE",
    "medicina",
    "educacao superior",
    "ranking",
    "mapa",
    "dados",
    "dashboard",
  ],
  openGraph: {
    title: "ENAMED 2025 | Painel de Medicina",
    description:
      "Analise visual do ENAMED 2025 para cursos de medicina, com rankings, mapas e indicadores.",
    type: "website",
    url: "/",
    siteName: "ENAMED 2025",
    locale: "pt_BR",
    images: [
      {
        url: "/meta/og-image.png",
        width: 1200,
        height: 630,
        alt: "Analise da Tabela do ENAMED",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENAMED 2025 | Painel de Medicina",
    description:
      "Analise visual do ENAMED 2025 para cursos de medicina, com rankings, mapas e indicadores.",
    images: ["/meta/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
