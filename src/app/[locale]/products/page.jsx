import {getTranslations, setRequestLocale} from "next-intl/server";
import {PackageOpen} from "lucide-react";
import {EmptyState} from "@/components/ui/EmptyState";
import {Pagination} from "@/components/ui/Pagination";
import {ProductCard} from "@/components/storefront/ProductCard";
import {StorefrontProductFilters} from "@/components/storefront/StorefrontProductFilters";
import {getStoreProducts} from "@/lib/data/products";
import {getActiveCategories} from "@/lib/data/categories";
import {seoAlternates} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({params, searchParams}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const sp = await searchParams;
  const page = Number.parseInt(sp?.page, 10);

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    alternates: seoAlternates(locale, "/products"),
    ...(Number.isFinite(page) && page > 1
      ? {robots: {index: false, follow: true}}
      : {}),
  };
}

export default async function ProductsPage({params, searchParams}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  const sp = await searchParams;
  const search = typeof sp?.search === "string" ? sp.search : "";
  const category = typeof sp?.category === "string" ? sp.category : "";
  const page = typeof sp?.page === "string" ? sp.page : undefined;

  const [result, categories] = await Promise.all([
    getStoreProducts(
      {search, categorySlug: category, page, pageSize: 12},
      locale
    ),
    getActiveCategories(locale),
  ]);

  const {items: products} = result;

  const buildHref = (nextPage) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("page", String(nextPage));
    return `/${locale}/products?${params.toString()}`;
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-2">
        <h1 className="text-h2 font-bold tracking-tight">{t("title")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </div>

      <StorefrontProductFilters
        categories={categories}
        initialSearch={search}
        initialCategory={category}
      />

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

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        buildHref={buildHref}
        namespace="products.pagination"
      />
    </section>
  );
}