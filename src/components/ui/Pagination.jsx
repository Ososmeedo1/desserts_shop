import {ChevronLeft, ChevronRight} from "lucide-react";
import {getTranslations} from "next-intl/server";
import Link from "next/link";

/**
 * Server-side pagination control: plain links, no client state.
 *
 * - `buildHref(nextPage)` builds the href for a given page, preserving any
 *   existing filters. Return `null`/`""` to disable a direction.
 * - `namespace` is the message key that holds `previous`, `next`,
 *   `pageInfo` and `label` (e.g. `admin.products.pagination`,
 *   `products.pagination`).
 * - `compact` renders a minimal variant (tighter tap targets, no page text).
 * - Renders nothing when `totalPages <= 1`.
 */
function PageButton({href, ariaLabel, disabled, children}) {
  const className =
    "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const disabledClassName =
    "pointer-events-none inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground/50";

  if (disabled || !href) {
    return (
      <span aria-disabled="true" className={disabledClassName}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className}>
      {children}
    </Link>
  );
}

export async function Pagination({page, totalPages, buildHref, namespace = "pagination", compact = false}) {
  const t = await getTranslations(namespace);

  if (totalPages <= 1) {
    return null;
  }

  const prevHref = buildHref(page - 1);
  const nextHref = buildHref(page + 1);
  const canPrevious = page > 1 && Boolean(prevHref);
  const canNext = page < totalPages && Boolean(nextHref);

  return (
    <nav
      aria-label={t("label")}
      className={compact ? "flex items-center justify-center gap-2" : "flex items-center justify-center gap-4 pt-2"}
    >
      <PageButton
        href={canPrevious ? prevHref : null}
        ariaLabel={t("previous")}
        disabled={!canPrevious}
      >
        <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
      </PageButton>

      {!compact ? (
        <p className="tabular-nums text-sm text-muted-foreground">
          {t("pageInfo", {page, totalPages})}
        </p>
      ) : null}

      <PageButton
        href={canNext ? nextHref : null}
        ariaLabel={t("next")}
        disabled={!canNext}
      >
        <ChevronRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
      </PageButton>
    </nav>
  );
}