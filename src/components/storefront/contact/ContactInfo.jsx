import {getTranslations} from "next-intl/server";
import {Clock, MapPin, MessageCircle, Phone} from "lucide-react";
import {ContactCard} from "./ContactCard";

function InstagramIcon({className}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({className}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function telHref(value) {
  return `tel:${String(value).replace(/[^\d+]/g, "")}`;
}

function waHref(value) {
  const digits = String(value).replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

function socialHref(value, base) {
  const v = String(value || "").trim();
  if (!v) {
    return null;
  }
  if (/^https?:\/\//i.test(v)) {
    return v;
  }
  return `${base}${v.replace(/^@/, "")}`;
}

export async function ContactInfo({settings}) {
  const t = await getTranslations("contact.info");
  const tFooter = await getTranslations("footer");

  const phone = settings?.phone || null;
  const whatsapp = settings?.whatsapp ? waHref(settings.whatsapp) : null;
  const whatsappRaw = settings?.whatsapp || null;
  const address = settings?.address || null;
  const openingHours = settings?.openingHours || null;
  const instagramHref = settings?.instagram
    ? socialHref(settings.instagram, "https://instagram.com/")
    : null;
  const facebookHref = settings?.facebook
    ? socialHref(settings.facebook, "https://facebook.com/")
    : null;

  const hasAny = Boolean(
    phone || whatsapp || address || openingHours || instagramHref || facebookHref
  );

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="contact-info-heading"
    >
      <h2 id="contact-info-heading" className="sr-only">
        {t("title")}
      </h2>

      {!hasAny ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
          {t("unavailable")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {phone ? (
            <ContactCard
              icon={<Phone className="h-6 w-6" />}
              title={t("phone")}
              href={telHref(phone)}
            >
              <span dir="ltr">{phone}</span>
            </ContactCard>
          ) : null}

          {whatsapp ? (
            <ContactCard
              icon={<MessageCircle className="h-6 w-6" />}
              title={t("whatsapp")}
              href={whatsapp}
              external
            >
              <span dir="ltr">{whatsappRaw}</span>
            </ContactCard>
          ) : null}

          {address ? (
            <ContactCard
              icon={<MapPin className="h-6 w-6" />}
              title={t("address")}
            >
              <span>{address}</span>
            </ContactCard>
          ) : null}

          {openingHours ? (
            <ContactCard
              icon={<Clock className="h-6 w-6" />}
              title={t("openingHours")}
            >
              <span>{openingHours}</span>
            </ContactCard>
          ) : null}

          {instagramHref || facebookHref ? (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="h-6 w-6 rtl:-scale-x-100" />
              </div>
              <h3 className="text-base font-semibold">{t("followUs")}</h3>
              <div className="mt-4 flex items-center gap-3">
                {instagramHref ? (
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tFooter("instagram")}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                ) : null}
                {facebookHref ? (
                  <a
                    href={facebookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tFooter("facebook")}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}