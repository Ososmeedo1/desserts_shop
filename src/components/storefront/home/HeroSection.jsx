import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {ArrowRight, CakeSlice, Sparkles} from "lucide-react";
import {Link} from "@/i18n/navigation";

function HeroVisual({heroImages = []}) {
  const primary = heroImages[0] ?? null;
  const secondary = heroImages[1] ?? null;

  return (
    <div className="relative flex items-center justify-center pb-10 ps-10">
      <div className="relative w-[220px] sm:w-[260px] lg:w-full lg:max-w-[380px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute start-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <Sparkles
          aria-hidden="true"
          className="pointer-events-none absolute -start-5 -top-5 h-4 w-4 text-ring"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2 -end-4 h-2.5 w-2.5 rounded-full bg-warning"
        />

        <div className="relative aspect-[3/4] overflow-hidden rounded-b-[28px] rounded-t-full border-8 border-surface bg-muted shadow-clay-lg">
          {primary ? (
            <Image
              src={primary.url}
              alt={primary.alt || ""}
              fill
              priority
              sizes="(max-width: 1024px) 220px, 380px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-primary/25 to-secondary/40">
              <CakeSlice className="h-16 w-16 text-secondary-foreground/70" />
            </div>
          )}
        </div>

        {secondary ? (
          <div className="absolute -bottom-5 -start-4 h-28 w-28 -rotate-6 overflow-hidden rounded-[20px] border-4 border-surface shadow-clay sm:-bottom-6 sm:h-32 sm:w-32 sm:-start-4 lg:-start-6">
            <Image
              src={secondary.url}
              alt={secondary.alt || ""}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function HeroSection({heroImages = []}) {
  const t = await getTranslations("home.hero");

  return (
    <section
      className="relative overflow-hidden bg-background"
      aria-label={t("label")}
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="text-center lg:text-start">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-bold text-primary-foreground">
              <Sparkles className="h-4 w-4 text-ring" />
              {t("overline")}
            </p>

            <h1 className="mt-6 text-h1 font-bold leading-[1.05] tracking-tight text-foreground sm:text-display">
              {t("title")}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-body-lg leading-relaxed text-muted-foreground lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-body-lg font-semibold text-primary-foreground shadow-clay-md transition-all duration-300 hover:bg-primary/90 hover:shadow-clay-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <HeroVisual heroImages={heroImages} />
          </div>
        </div>
      </div>
    </section>
  );
}