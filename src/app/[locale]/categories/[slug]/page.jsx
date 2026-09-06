import Image from "next/image";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {ChevronRight, PackageOpen} from "lucide-react";
import {EmptyState} from "@/components/ui";
import {ProductCard} from "@/components/storefront/ProductCard";
import {Link} from "@/i18n/navigation";
import {getCategoryBySlug, getProductsByCategory, getActiveCategories} from "@/lib/data/categories";
import {seoAlternates} from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getActiveCategories("en");
  return categories.flatMap((category) => [
    {locale: "ar", slug: category.slug},
    {locale: "en", slug: category.slug},
  ]);
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    return {};
  }

  return {
    title: category.name,
    description: category.description || undefined,
    alternates: seoAlternates(locale, `/categories/${slug}`),
    openGraph: {
      title: category.name,
      description: category.description || undefined,
      images: category.image?.url ? [category.image.url] : [],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description: category.description || undefined,
      images: category.image?.url ? [category.image.url] : [],
    },
  };
}

export default async function CategoryPage({params}) {
  const {locale, slug} = await params;

  setRequestLocale(locale);

  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.slug, locale);

  const t = await getTranslations("categoryPage");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav
        aria-label={t("breadcrumbs")}
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("breadcrumbHome")}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <Link
          href="/products"
          className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("breadcrumbCategories")}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <span className="max-w-[16rem] truncate text-foreground">
          {category.name}
        </span>
      </nav>

      <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
        <div className="space-y-4">
          <h1 className="text-h2 font-bold tracking-tight">
            {category.name}
          </h1>
          {category.description ? (
            <p className="max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          ) : null}
        </div>

        {category.image ? (
          <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted shadow-clay-md">
            <Image
              src={category.image.url}
              alt={category.image.alt || category.name || ""}
              fill
              priority
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </header>

      <section className="mt-12" aria-labelledby="category-products-heading">
        {products.length === 0 ? (
          <EmptyState
            icon={<PackageOpen className="h-10 w-10" />}
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}