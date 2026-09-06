"use client";

import {MessageCircle} from "lucide-react";
import {formatPrice} from "@/lib/catalog";
import {cn} from "@/lib/utils";
import {useProductOrder} from "./ProductOrderProvider";

export function ProductDetailsClient({product, labels, currency, locale}) {
  const {
    selectedUnitIndex,
    setSelectedUnitIndex,
    selectedAddOnIndexes,
    toggleAddOn,
    totalPrice,
    whatsappUrl,
    unavailable,
  } = useProductOrder();

  const hasUnit = product.hasMeasuringUnit && product.measuringUnit.options.length > 0;
  const hasAddOns = product.addOns.length > 0;

  return (
    <div className="space-y-6">
      {hasUnit || hasAddOns ? (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold tracking-tight">
            {labels.optionsTitle}
          </h2>

          {hasUnit ? (
            <fieldset className="space-y-3">
              <legend className="flex items-baseline gap-1.5 text-sm font-semibold">
                {labels.unitType?.[product.measuringUnit.unitType] ?? "..."}
              </legend>

              <div className="flex max-w-md flex-wrap gap-2">
                {product.measuringUnit.options.map((option, optionIndex) => {
                  const checked = selectedUnitIndex === optionIndex;
                  return (
                    <label
                      key={option.name}
                      className={cn(
                        "cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        checked
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                          : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground"
                      )}
                    >
                      <input
                        type="radio"
                        name="measuring-unit"
                        checked={checked}
                        onChange={() => setSelectedUnitIndex(optionIndex)}
                        className="sr-only"
                      />
                      <span className="inline-flex flex-col gap-0.5">
                        <span>{option.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatPrice(option.price, locale)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {hasAddOns ? (
            <fieldset className="space-y-3">
              <legend className="flex items-baseline gap-1.5 text-sm font-semibold">
                {labels.addOnsLabel}
              </legend>

              <div className="flex max-w-md flex-wrap gap-2">
                {product.addOns.map((option, optionIndex) => {
                  const checked = selectedAddOnIndexes.includes(optionIndex);
                  return (
                    <label
                      key={option.name}
                      className={cn(
                        "cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        checked
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                          : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddOn(optionIndex)}
                        className="sr-only"
                      />
                      <span className="inline-flex flex-col gap-0.5">
                        <span>{option.name}</span>
                        <span className="text-xs text-muted-foreground">
                          +{formatPrice(option.price, locale)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            {labels.total}
          </span>
          <span className="text-3xl font-bold tracking-tight text-primary">
            {formatPrice(totalPrice, locale)}{" "}
            <span className="text-xl font-semibold">{currency}</span>
          </span>
        </div>

        <a
          data-order-cta="main"
          href={whatsappUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={unavailable}
          tabIndex={unavailable ? -1 : 0}
          className={cn(
            "hidden h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-medium text-primary-foreground transition-colors sm:inline-flex",
            "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            unavailable && "pointer-events-none opacity-50"
          )}
        >
          <MessageCircle className="h-5 w-5" />
          {labels.cta}
        </a>
      </div>
    </div>
  );
}