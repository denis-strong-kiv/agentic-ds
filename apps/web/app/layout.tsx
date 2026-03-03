// Root layout — minimal shell.
// The <html> and <body> tags are rendered by app/[locale]/layout.tsx.
// This file exists to satisfy Next.js App Router requirements.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
