import {getTranslations} from "next-intl/server";
import {Mail, MessageCircle} from "lucide-react";
import {Link} from "@/i18n/navigation";

function waHref(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export async function ContactCTASection({settings}) {
  const t = await getTranslations("home.contactCta");

  const whatsappHref = settings?.whatsapp ? waHref(settings.whatsapp) : null;

  return (
    <section className="bg-background py-section" aria-labelledby="contact-cta-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-surface px-5 py-10 text-center shadow-clay-md sm:px-12 sm:py-14">
          <h2 id="contact-cta-heading" className="text-h3 font-bold tracking-tight sm:text-h2">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-clay-md transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                {t("whatsappButton")}
              </a>
            ) : null}
            <Link
              href="/contact"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-base font-medium transition-colors hover:bg-muted hover:text-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
            >
              <Mail className="h-5 w-5" />
              {t("contactButton")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}