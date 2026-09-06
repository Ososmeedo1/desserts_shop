import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {getLocale} from "next-intl/server";
import {CakeSlice} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {Badge} from "@/components/ui";

function formatNumber(value, locale) {
  const numberLocale = locale === "ar" ? "ar-u-nu-latn" : locale;
  return new Intl.NumberFormat(numberLocale, {maximumFractionDigits: 2}).format(
    value
  );
}

export async function ProductCard({product}) {
  const locale = await getLocale();
  const t = await getTranslations("products");

  const price = formatNumber(product.price, locale);
  const oldPrice =
    typeof product.oldPrice === "number"
      ? formatNumber(product.oldPrice, locale)
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-clay-sm transition-shadow duration-300 hover:shadow-clay-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:rounded-3xl"
    >
      <div className="relative aspect-square overflow-hidden bg-muted sm:aspect-[4/5]">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.image.alt || product.name || ""}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 md:group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CakeSlice className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {product.isAvailable === false ? (
          <Badge
            variant="secondary"
            className="absolute start-2 top-2 px-2 py-0.5 text-[10px]"
          >
            {t("unavailable")}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
        <h3 className="line-clamp-2 text-caption font-semibold leading-tight sm:text-body">
          {product.name}
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-1">
          <span className="text-base font-bold tabular-nums text-foreground sm:text-lg">
            {product.hasMeasuringUnit
              ? t("fromPrice", {price})
              : t("price", {price})}
          </span>
          {oldPrice ? (
            <span className="text-[11px] text-muted-foreground line-through sm:text-xs">
              {t("price", {price: oldPrice})}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}