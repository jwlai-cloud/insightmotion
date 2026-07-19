import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightMotion | AI-directed live data briefs",
  description: "AI-generated, attention-directed data briefs for OpenAI Build Week.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
