import {getTranslations} from "next-intl/server";
import {CakeSlice} from "lucide-react";

export async function BrandStorySection() {
  const t = await getTranslations("home.brandStory");

  return (
    <section className="bg-background py-section" aria-labelledby="brand-story-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 id="brand-story-heading" className="text-h3 font-bold tracking-tight sm:text-h2">
              {t("title")}
            </h2>
            <p className="text-body leading-relaxed text-muted-foreground">{t("paragraph1")}</p>
            <p className="text-body leading-relaxed text-muted-foreground">{t("paragraph2")}</p>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-surface shadow-clay-md sm:rounded-3xl">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <CakeSlice className="h-14 w-14 text-primary/70" />
              <span className="text-sm font-medium">{t("illustrationLabel")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}