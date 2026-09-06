"use client";

import {useMemo} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Loader2} from "lucide-react";
import {settingsSchema} from "@/lib/validations/settings";
import {Card, CardContent} from "@/components/ui/Card";
import {Input} from "@/components/ui/Input";
import {Textarea} from "@/components/ui/Textarea";
import {Label} from "@/components/ui/Label";
import {Button} from "@/components/ui/Button";
import {ImageUploadField} from "@/components/admin/fields/ImageUploadField";

const emptyValues = {
  brandName: {ar: "", en: ""},
  logo: {url: "", fileId: "", alt: {ar: "", en: ""}},
  favicon: {url: "", fileId: "", alt: {ar: "", en: ""}},
  phone: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  address: {ar: "", en: ""},
  openingHours: {ar: "", en: ""},
  contactMessage: {ar: "", en: ""},
  mapLatitude: "",
  mapLongitude: "",
};

export function SettingsForm({settings, locale}) {
  const t = useTranslations("admin.settingsForm");
  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      brandName: {
        ar: settings.brandName?.ar ?? "",
        en: settings.brandName?.en ?? "",
      },
      logo: {
        url: settings.logo?.url ?? "",
        fileId: settings.logo?.fileId ?? "",
        alt: {
          ar: settings.logo?.alt?.ar ?? "",
          en: settings.logo?.alt?.en ?? "",
        },
      },
      favicon: {
        url: settings.favicon?.url ?? "",
        fileId: settings.favicon?.fileId ?? "",
        alt: {
          ar: settings.favicon?.alt?.ar ?? "",
          en: settings.favicon?.alt?.en ?? "",
        },
      },
      phone: settings.phone ?? "",
      whatsapp: settings.whatsapp ?? "",
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      address: {
        ar: settings.address?.ar ?? "",
        en: settings.address?.en ?? "",
      },
      openingHours: {
        ar: settings.openingHours?.ar ?? "",
        en: settings.openingHours?.en ?? "",
      },
      contactMessage: {
        ar: settings.contactMessage?.ar ?? "",
        en: settings.contactMessage?.en ?? "",
      },
      mapLatitude: settings.mapLatitude ?? "",
      mapLongitude: settings.mapLongitude ?? "",
    };
  }, [settings]);

  const schema = useMemo(
    () =>
      settingsSchema({
        invalidUrl: t("validation.invalidUrl"),
        invalidCoordinate: t("validation.invalidCoordinate"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    if (data.logo?.url) {
      data.logo.alt = {ar: data.brandName.ar || "", en: data.brandName.en || ""};
    }
    if (data.favicon?.url) {
      data.favicon.alt = {ar: data.brandName.ar || "", en: data.brandName.en || ""};
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        if (body?.error === "UNAUTHORIZED") {
          router.replace(`/${locale}/admin/login`);
        } else {
          toast.error(t("errorGeneric"));
        }
        return;
      }

      toast.success(t("successUpdate"));
      reset(getValues(), {keepDefaultValues: true});
      router.refresh();
    } catch {
      toast.error(t("errorGeneric"));
    }
  });

  const sectionTitle =
    "text-sm font-semibold uppercase tracking-wide text-muted-foreground";

  const disabled = isSubmitting || isSubmitSuccessful;

  return (
    <Card className="max-w-3xl shadow-soft">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} noValidate className="space-y-8">
          {/* Brand Identity */}
          <div className="space-y-4">
            <h3 className={sectionTitle}>{t("sectionBrand")}</h3>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brandName.ar">{t("labels.brandNameAr")}</Label>
                <Input
                  id="brandName.ar"
                  dir="rtl"
                  placeholder={t("placeholders.brandNameAr")}
                  aria-invalid={errors.brandName?.ar ? "true" : undefined}
                  aria-describedby={
                    errors.brandName?.ar ? "brandName.ar-error" : undefined
                  }
                  {...register("brandName.ar")}
                />
                {errors.brandName?.ar ? (
                  <p id="brandName.ar-error" className="text-sm text-error">
                    {errors.brandName.ar.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName.en">{t("labels.brandNameEn")}</Label>
                <Input
                  id="brandName.en"
                  dir="ltr"
                  placeholder={t("placeholders.brandNameEn")}
                  aria-invalid={errors.brandName?.en ? "true" : undefined}
                  aria-describedby={
                    errors.brandName?.en ? "brandName.en-error" : undefined
                  }
                  {...register("brandName.en")}
                />
                {errors.brandName?.en ? (
                  <p id="brandName.en-error" className="text-sm text-error">
                    {errors.brandName.en.message}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <ImageUploadField
                control={control}
                name="logo"
                altFallback={t("logoAltFallback")}
                disabled={disabled}
                className="max-w-md"
                ariaDescribedBy={errors.logo?.url ? "logo-url-error" : undefined}
              />
              {errors.logo?.url ? (
                <p id="logo-url-error" className="text-sm text-error">
                  {errors.logo.url.message}
                </p>
              ) : null}
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <ImageUploadField
                control={control}
                name="favicon"
                altFallback={t("faviconAltFallback")}
                disabled={disabled}
                className="max-w-40"
                ariaDescribedBy={errors.favicon?.url ? "favicon-url-error" : undefined}
              />
              {errors.favicon?.url ? (
                <p id="favicon-url-error" className="text-sm text-error">
                  {errors.favicon.url.message}
                </p>
              ) : null}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4 border-t border-border pt-8">
            <h3 className={sectionTitle}>{t("sectionContact")}</h3>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("labels.phone")}</Label>
                <Input
                  id="phone"
                  dir="ltr"
                  placeholder={t("placeholders.phone")}
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">{t("labels.whatsapp")}</Label>
                <Input
                  id="whatsapp"
                  dir="ltr"
                  placeholder={t("placeholders.whatsapp")}
                  {...register("whatsapp")}
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">{t("labels.instagram")}</Label>
                <Input
                  id="instagram"
                  dir="ltr"
                  placeholder={t("placeholders.instagram")}
                  {...register("instagram")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">{t("labels.facebook")}</Label>
                <Input
                  id="facebook"
                  dir="ltr"
                  placeholder={t("placeholders.facebook")}
                  {...register("facebook")}
                />
              </div>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-4 border-t border-border pt-8">
            <h3 className={sectionTitle}>{t("sectionLocation")}</h3>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address.ar">{t("labels.addressAr")}</Label>
                <Textarea
                  id="address.ar"
                  dir="rtl"
                  placeholder={t("placeholders.addressAr")}
                  {...register("address.ar")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.en">{t("labels.addressEn")}</Label>
                <Textarea
                  id="address.en"
                  dir="ltr"
                  placeholder={t("placeholders.addressEn")}
                  {...register("address.en")}
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="openingHours.ar">{t("labels.openingHoursAr")}</Label>
                <Textarea
                  id="openingHours.ar"
                  dir="rtl"
                  placeholder={t("placeholders.openingHoursAr")}
                  {...register("openingHours.ar")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours.en">{t("labels.openingHoursEn")}</Label>
                <Textarea
                  id="openingHours.en"
                  dir="ltr"
                  placeholder={t("placeholders.openingHoursEn")}
                  {...register("openingHours.en")}
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mapLatitude">{t("labels.latitude")}</Label>
                <Input
                  id="mapLatitude"
                  type="number"
                  step="0.0001"
                  dir="ltr"
                  placeholder={t("placeholders.latitude")}
                  aria-invalid={errors.mapLatitude ? "true" : undefined}
                  aria-describedby={
                    errors.mapLatitude ? "mapLatitude-error" : undefined
                  }
                  {...register("mapLatitude")}
                />
                {errors.mapLatitude ? (
                  <p id="mapLatitude-error" className="text-sm text-error">
                    {errors.mapLatitude.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapLongitude">{t("labels.longitude")}</Label>
                <Input
                  id="mapLongitude"
                  type="number"
                  step="0.0001"
                  dir="ltr"
                  placeholder={t("placeholders.longitude")}
                  aria-invalid={errors.mapLongitude ? "true" : undefined}
                  aria-describedby={
                    errors.mapLongitude ? "mapLongitude-error" : undefined
                  }
                  {...register("mapLongitude")}
                />
                {errors.mapLongitude ? (
                  <p id="mapLongitude-error" className="text-sm text-error">
                    {errors.mapLongitude.message}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("coordinatesHint")}
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-4 border-t border-border pt-8">
            <h3 className={sectionTitle}>{t("sectionMessages")}</h3>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactMessage.ar">{t("labels.contactMessageAr")}</Label>
                <Textarea
                  id="contactMessage.ar"
                  dir="rtl"
                  placeholder={t("placeholders.contactMessageAr")}
                  {...register("contactMessage.ar")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactMessage.en">{t("labels.contactMessageEn")}</Label>
                <Textarea
                  id="contactMessage.en"
                  dir="ltr"
                  placeholder={t("placeholders.contactMessageEn")}
                  {...register("contactMessage.en")}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={disabled}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {t("submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
