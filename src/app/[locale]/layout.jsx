import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPublicSiteSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/seo";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeFix } from "@/components/ThemeFix";
import { ThemeNavGuard } from "@/components/ThemeNavGuard";
import "../globals.css";

const cairo = Cairo({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "arabic"],
  display: "swap",
  variable: "--font-cairo",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return {
    metadataBase: new URL(siteUrl()),
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  setRequestLocale(locale);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const settings = await getPublicSiteSettings(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeFix />
        <ThemeNavGuard />
        <NextIntlClientProvider>
          <SkipLink />
          <Header settings={settings} />
          <main id="main-content" tabIndex={-1} className="w-full flex-1">
            {children}
          </main>
          <Footer settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}