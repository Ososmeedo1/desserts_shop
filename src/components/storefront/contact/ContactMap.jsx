import {getTranslations} from "next-intl/server";
import {MapPin} from "lucide-react";
import {Card} from "@/components/ui/Card";

export const DEFAULT_LATITUDE = 30.0444;
export const DEFAULT_LONGITUDE = 31.2357;

function toFixedCoordinate(value, fallback) {
  if (value === null || value === undefined || value === "") {
    return fallback.toFixed(6);
  }
  const num = Number(value);
  return (Number.isFinite(num) ? num : fallback).toFixed(6);
}

export function buildGoogleMapsDirectionsUrl(latitude, longitude) {
  const lat = toFixedCoordinate(latitude, DEFAULT_LATITUDE);
  const lng = toFixedCoordinate(longitude, DEFAULT_LONGITUDE);
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export async function ContactMap({settings}) {
  const t = await getTranslations("contact.map");

  const lat = toFixedCoordinate(settings?.mapLatitude, DEFAULT_LATITUDE);
  const lng = toFixedCoordinate(settings?.mapLongitude, DEFAULT_LONGITUDE);
  const href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="contact-map-heading"
    >
      <Card className="bg-surface p-6 shadow-clay-md" id="contact-map-card">
        <h2
          id="contact-map-heading"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
        >
          <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          {t("title")}
        </h2>
        {settings?.address ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {settings.address}
          </p>
        ) : null}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-clay-md transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
        >
          <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
          {t("getDirections")}
        </a>
      </Card>
    </section>
  );
}