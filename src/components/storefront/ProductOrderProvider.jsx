"use client";

import {createContext, useCallback, useContext, useState} from "react";
import {MessageCircle} from "lucide-react";
import {formatPrice} from "@/lib/catalog";
import {cn} from "@/lib/utils";

function parseWhatsAppNumber(number) {
  const digits = (number || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

function buildWhatsAppUrl(product, optionsSummary, totalPrice, labels, whatsappLink, currency) {
  if (!whatsappLink) {
    return null;
  }

  const lines = [`${labels.greeting}, ${labels.orderPrefix} ${product.name}`];
  if (product.hasMeasuringUnit && optionsSummary.measuringUnit) {
    lines.push(`${labels.sizeLabel} ${optionsSummary.measuringUnit}`);
  }
  if (optionsSummary.addOns.length > 0) {
    lines.push(`${labels.extrasLabel} ${optionsSummary.addOns.join(", ")}`);
  }
  lines.push(`${labels.totalLabel} ${formatPrice(totalPrice, "en")} ${currency}`);

  return `${whatsappLink}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function buildOptionSummary(product, unitIndex, selectedAddOnIndexes) {
  const measuringUnit = product.hasMeasuringUnit
    ? product.measuringUnit.options[unitIndex]?.name ?? null
    : null;

  const addOns = selectedAddOnIndexes.map(
    (index) => product.addOns[index]?.name
  ).filter(Boolean);

  return {
    measuringUnit,
    addOns,
  };
}

function calculateTotalPrice(product, unitIndex, selectedAddOnIndexes) {
  let total = typeof product.price === "number" ? product.price : 0;

  if (product.hasMeasuringUnit) {
    const unitOption = product.measuringUnit?.options?.[unitIndex];
    if (unitOption && typeof unitOption.price === "number") {
      total = unitOption.price;
    }
  }

  for (const index of selectedAddOnIndexes) {
    const addOn = product.addOns?.[index];
    if (addOn && typeof addOn.price === "number") {
      total += addOn.price;
    }
  }

  return total;
}

const ProductOrderContext = createContext(null);

export function useProductOrder() {
  const context = useContext(ProductOrderContext);

  if (!context) {
    throw new Error("useProductOrder must be used within ProductOrderProvider");
  }

  return context;
}

export function ProductOrderProvider({
  product,
  whatsappNumber = null,
  labels,
  currency,
  locale,
  children,
}) {
  const whatsappLink = parseWhatsAppNumber(whatsappNumber);
  const unavailable = !whatsappLink || product.isAvailable === false;

  const initialUnitIndex = useCallback(() => {
    if (!product.hasMeasuringUnit) {
      return 0;
    }
    return product.measuringUnit?.options?.length > 0 ? 0 : -1;
  }, [product]);

  const [selectedUnitIndex, setSelectedUnitIndex] = useState(initialUnitIndex);
  const [selectedAddOnIndexes, setSelectedAddOnIndexes] = useState(() => []);

  const toggleAddOn = useCallback((index) => {
    setSelectedAddOnIndexes((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  }, []);

  const totalPrice = calculateTotalPrice(
    product,
    selectedUnitIndex,
    selectedAddOnIndexes
  );

  const optionsSummary = buildOptionSummary(
    product,
    selectedUnitIndex,
    selectedAddOnIndexes,
    locale
  );

  const whatsappUrl = buildWhatsAppUrl(
    product,
    optionsSummary,
    totalPrice,
    labels,
    whatsappLink,
    currency
  );

  const value = {
    selectedUnitIndex,
    setSelectedUnitIndex,
    selectedAddOnIndexes,
    toggleAddOn,
    totalPrice,
    optionsSummary,
    whatsappUrl,
    unavailable,
  };

  return (
    <ProductOrderContext.Provider value={value}>
      {children}
      <div
        data-sticky-order-bar
        className="sticky bottom-0 z-40 mt-2 w-full border-t border-border/50 bg-background/95 px-4 pb-3 pt-3 shadow-clay-md backdrop-blur-md sm:hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex shrink-0 basis-auto items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums tracking-tight">
              {formatPrice(totalPrice, locale)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {currency}
            </span>
          </div>
          <a
            data-order-cta="sticky"
            href={whatsappUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={unavailable}
            tabIndex={unavailable ? -1 : 0}
            className={cn(
              "inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-clay-md transition-colors duration-300",
              "hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              unavailable && "pointer-events-none opacity-50"
            )}
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span className="truncate">{labels.cta}</span>
          </a>
        </div>
      </div>
    </ProductOrderContext.Provider>
  );
}