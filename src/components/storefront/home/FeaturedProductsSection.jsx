import {getTranslations} from "next-intl/server";
import {ArrowRight} from "lucide-react";
import {ProductCard} from "@/components/storefront/ProductCard";
import {Link} from "@/i18n/navigation";

export async function FeaturedProductsSection({products = []}) {
  const t = await getTranslations("home.featured");

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-background py-section"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
          <h2
            id="featured-heading"
            className="text-h3 font-bold tracking-tight sm:text-h2"
          >
            {t("title")}
          </h2>
          <Link
            href="/products"
            className="-mx-1 -my-2 inline-flex items-center gap-1.5 rounded-sm px-1 py-2 text-sm font-semibold text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}