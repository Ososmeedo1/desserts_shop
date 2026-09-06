import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {CakeSlice} from "lucide-react";
import {Link} from "@/i18n/navigation";

export async function CategoriesSection({categories = []}) {
  const t = await getTranslations("home.categories");

  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-background py-section"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2
            id="categories-heading"
            className="text-h3 font-bold tracking-tight sm:text-h2"
          >
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-surface shadow-clay-sm transition-shadow duration-300 hover:shadow-clay-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:aspect-[4/5] sm:rounded-3xl"
            >
              {category.image?.url ? (
                <Image
                  src={category.image.url}
                  alt={category.image.alt || category.name || ""}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 md:group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <CakeSlice className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent"
              />
              <div className="absolute bottom-0 start-0 end-0 p-3 sm:p-4">
                <h3 className="line-clamp-2 text-caption font-bold leading-tight text-background sm:text-body">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}