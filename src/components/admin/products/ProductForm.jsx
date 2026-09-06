"use client";

import {useMemo} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {useForm, useFieldArray, useController} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Loader2, Plus, Trash2} from "lucide-react";
import {productSchema} from "@/lib/validations/product";
import {Card, CardContent} from "@/components/ui/Card";
import {Input} from "@/components/ui/Input";
import {Textarea} from "@/components/ui/Textarea";
import {Label} from "@/components/ui/Label";
import {Button} from "@/components/ui/Button";
import {Select} from "@/components/ui/Select";
import {ImageUploadField} from "@/components/admin/fields/ImageUploadField";

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyImage = {url: "", fileId: "", alt: {ar: "", en: ""}, isPrimary: false, sortOrder: 0};

function FieldError({message, id}) {
  return message ? (
    <p id={id} className="text-sm text-error">
      {message}
    </p>
  ) : null;
}

function MeasuringUnitFields({control, register, errors}) {
  const t = useTranslations("admin.productForm");
  const {fields, append, remove} = useFieldArray({
    control,
    name: "measuringUnit.options",
  });

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold tracking-tight">
          {t("labels.measuringUnit")}
        </h4>
        <p className="text-sm text-muted-foreground">{t("measuringUnitHint")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-unit-type">{t("labels.unitType")}</Label>
          <Select
            id="product-unit-type"
            {...register("measuringUnit.unitType")}
            aria-invalid={errors.measuringUnit?.unitType ? "true" : undefined}
            aria-describedby={
              errors.measuringUnit?.unitType
                ? "product-unit-type-error"
                : undefined
            }
          >
            <option value="">{t("labels.selectUnitType")}</option>
            <option value="weight">{t("labels.unitTypeWeight")}</option>
            <option value="pieces">{t("labels.unitTypePieces")}</option>
            <option value="size">{t("labels.unitTypeSize")}</option>
          </Select>
          <FieldError
            id="product-unit-type-error"
            message={errors.measuringUnit?.unitType?.message}
          />
        </div>
        <div className="flex items-end pb-1">
          <p className="text-xs text-muted-foreground">{t("unitTypeHint")}</p>
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((option, optionIndex) => (
          <div
            key={option.id}
            className="space-y-3 rounded-xl border border-border bg-background p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("labels.unitOptionNameEn")} #{optionIndex + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(optionIndex)}
                aria-label={t("removeUnitOption")}
                title={t("removeUnitOption")}
                className="h-8 w-8 px-0 text-muted-foreground hover:text-error"
              >
                <Trash2 className="h-4 w-4 rtl:-scale-x-100" />
              </Button>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`unit-name-ar-${optionIndex}`}>
                  {t("labels.unitOptionNameAr")}
                </Label>
                <Input
                  id={`unit-name-ar-${optionIndex}`}
                  dir="rtl"
                  placeholder={t("placeholders.unitOptionNameAr")}
                  aria-invalid={
                    errors.measuringUnit?.options?.[optionIndex]?.name?.ar
                      ? "true"
                      : undefined
                  }
                  aria-describedby={
                    errors.measuringUnit?.options?.[optionIndex]?.name?.ar
                      ? `unit-name-ar-${optionIndex}-error`
                      : undefined
                  }
                  {...register(`measuringUnit.options.${optionIndex}.name.ar`)}
                />
                <FieldError
                  id={`unit-name-ar-${optionIndex}-error`}
                  message={
                    errors.measuringUnit?.options?.[optionIndex]?.name?.ar?.message
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`unit-name-en-${optionIndex}`}>
                  {t("labels.unitOptionNameEn")}
                </Label>
                <Input
                  id={`unit-name-en-${optionIndex}`}
                  dir="ltr"
                  placeholder={t("placeholders.unitOptionNameEn")}
                  aria-invalid={
                    errors.measuringUnit?.options?.[optionIndex]?.name?.en
                      ? "true"
                      : undefined
                  }
                  aria-describedby={
                    errors.measuringUnit?.options?.[optionIndex]?.name?.en
                      ? `unit-name-en-${optionIndex}-error`
                      : undefined
                  }
                  {...register(`measuringUnit.options.${optionIndex}.name.en`)}
                />
                <FieldError
                  id={`unit-name-en-${optionIndex}-error`}
                  message={
                    errors.measuringUnit?.options?.[optionIndex]?.name?.en?.message
                  }
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`unit-price-${optionIndex}`}>
                  {t("labels.unitOptionPrice")}
                </Label>
                <Input
                  id={`unit-price-${optionIndex}`}
                  dir="ltr"
                  type="number"
                  min="0"
                  step="0.5"
                  aria-invalid={
                    errors.measuringUnit?.options?.[optionIndex]?.price
                      ? "true"
                      : undefined
                  }
                  aria-describedby={
                    errors.measuringUnit?.options?.[optionIndex]?.price
                      ? `unit-price-${optionIndex}-error`
                      : undefined
                  }
                  {...register(`measuringUnit.options.${optionIndex}.price`)}
                />
                <FieldError
                  id={`unit-price-${optionIndex}-error`}
                  message={
                    errors.measuringUnit?.options?.[optionIndex]?.price?.message
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`unit-sort-${optionIndex}`}>
                  {t("labels.sortOrder")}
                </Label>
                <Input
                  id={`unit-sort-${optionIndex}`}
                  dir="ltr"
                  type="number"
                  min="0"
                  step="1"
                  {...register(`measuringUnit.options.${optionIndex}.sortOrder`)}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  id={`unit-active-${optionIndex}`}
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...register(`measuringUnit.options.${optionIndex}.isActive`)}
                />
                <Label htmlFor={`unit-active-${optionIndex}`}>
                  {t("labels.unitOptionActive")}
                </Label>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              name: {ar: "", en: ""},
              price: 0,
              isActive: true,
              sortOrder: fields.length,
            })
          }
        >
          <Plus className="h-4 w-4" />
          {t("addUnitOption")}
        </Button>

        {errors.measuringUnit?.options?.message ? (
          <FieldError message={errors.measuringUnit.options.message} />
        ) : null}
      </div>
    </div>
  );
}

function AddOnFields({control, register, errors}) {
  const t = useTranslations("admin.productForm");
  const {fields, append, remove} = useFieldArray({control, name: "addOns"});

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4">
      <h4 className="text-sm font-semibold tracking-tight">{t("labels.addOnSection")}</h4>

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noUnitsHint")}</p>
      ) : null}

      {fields.map((option, optionIndex) => (
        <div
          key={option.id}
          className="space-y-3 rounded-xl border border-border bg-background p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("labels.addOnNameEn")} #{optionIndex + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(optionIndex)}
              aria-label={t("removeAddOn")}
              title={t("removeAddOn")}
              className="h-8 w-8 px-0 text-muted-foreground hover:text-error"
            >
              <Trash2 className="h-4 w-4 rtl:-scale-x-100" />
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`addon-name-ar-${optionIndex}`}>
                {t("labels.addOnNameAr")}
              </Label>
              <Input
                id={`addon-name-ar-${optionIndex}`}
                dir="rtl"
                placeholder={t("placeholders.addOnNameAr")}
                aria-invalid={
                  errors.addOns?.[optionIndex]?.name?.ar ? "true" : undefined
                }
                aria-describedby={
                  errors.addOns?.[optionIndex]?.name?.ar
                    ? `addon-name-ar-${optionIndex}-error`
                    : undefined
                }
                {...register(`addOns.${optionIndex}.name.ar`)}
              />
              <FieldError
                id={`addon-name-ar-${optionIndex}-error`}
                message={errors.addOns?.[optionIndex]?.name?.ar?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`addon-name-en-${optionIndex}`}>
                {t("labels.addOnNameEn")}
              </Label>
              <Input
                id={`addon-name-en-${optionIndex}`}
                dir="ltr"
                placeholder={t("placeholders.addOnNameEn")}
                aria-invalid={
                  errors.addOns?.[optionIndex]?.name?.en ? "true" : undefined
                }
                aria-describedby={
                  errors.addOns?.[optionIndex]?.name?.en
                    ? `addon-name-en-${optionIndex}-error`
                    : undefined
                }
                {...register(`addOns.${optionIndex}.name.en`)}
              />
              <FieldError
                id={`addon-name-en-${optionIndex}-error`}
                message={errors.addOns?.[optionIndex]?.name?.en?.message}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor={`addon-price-${optionIndex}`}>
                {t("labels.addOnPrice")}
              </Label>
              <Input
                id={`addon-price-${optionIndex}`}
                dir="ltr"
                type="number"
                min="0"
                step="0.5"
                aria-invalid={
                  errors.addOns?.[optionIndex]?.price ? "true" : undefined
                }
                aria-describedby={
                  errors.addOns?.[optionIndex]?.price
                    ? `addon-price-${optionIndex}-error`
                    : undefined
                }
                {...register(`addOns.${optionIndex}.price`)}
              />
              <FieldError
                id={`addon-price-${optionIndex}-error`}
                message={errors.addOns?.[optionIndex]?.price?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`addon-sort-${optionIndex}`}>
                {t("labels.sortOrder")}
              </Label>
              <Input
                id={`addon-sort-${optionIndex}`}
                dir="ltr"
                type="number"
                min="0"
                step="1"
                {...register(`addOns.${optionIndex}.sortOrder`)}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                id={`addon-active-${optionIndex}`}
                type="checkbox"
                className="h-4 w-4 accent-primary"
                {...register(`addOns.${optionIndex}.isActive`)}
              />
              <Label htmlFor={`addon-active-${optionIndex}`}>
                {t("labels.addOnActive")}
              </Label>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            name: {ar: "", en: ""},
            price: 0,
            isActive: true,
            sortOrder: fields.length,
          })
        }
      >
        <Plus className="h-4 w-4" />
        {t("addAddOn")}
      </Button>
    </div>
  );
}

function PrimaryImageCheckbox({control, name, onMakePrimary}) {
  const t = useTranslations("admin.productForm");
  const {field} = useController({control, name});

  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={field.value === true}
        onChange={(event) => {
          if (event.target.checked) {
            onMakePrimary();
          } else {
            field.onChange(false);
          }
        }}
        className="h-4 w-4 accent-primary"
      />
      <span className="text-sm font-medium leading-none">
        {t("labels.isPrimary")}
      </span>
    </label>
  );
}

export function ProductForm({mode, product, categories, locale}) {
  const t = useTranslations("admin.productForm");
  const router = useRouter();

  const defaultValues = useMemo(() => {
    if (mode === "edit" && product) {
      return {
        name: {ar: product.name?.ar ?? "", en: product.name?.en ?? ""},
        slug: product.slug ?? "",
        description: {
          ar: product.description?.ar ?? "",
          en: product.description?.en ?? "",
        },
        category: product.category ?? "",
        price: typeof product.price === "number" ? product.price : 0,
        oldPrice:
          typeof product.oldPrice === "number" ? String(product.oldPrice) : "",
        unitLabel: {
          ar: product.unitLabel?.ar ?? "",
          en: product.unitLabel?.en ?? "",
        },
        isActive: product.isActive ?? true,
        isAvailable: product.isAvailable ?? true,
        isFeatured: product.isFeatured ?? false,
        sortOrder: product.sortOrder ?? 0,
        images: (Array.isArray(product.images) ? product.images : []).map(
          (image) => ({
            url: image.url ?? "",
            fileId: image.fileId ?? "",
            alt: image.alt ?? {ar: "", en: ""},
            isPrimary: image.isPrimary === true,
            sortOrder: image.sortOrder ?? 0,
          })
        ),
        measuringUnit: {
          unitType: product.hasMeasuringUnit
            ? (product.measuringUnit?.unitType ?? "size")
            : "",
          options: (Array.isArray(product.measuringUnit?.options)
            ? product.measuringUnit.options
            : []
          ).map((option) => ({
            name: option.name ?? {ar: "", en: ""},
            price: typeof option.price === "number" ? option.price : 0,
            isActive: option.isActive !== false,
            sortOrder: option.sortOrder ?? 0,
          })),
        },
        addOns: (Array.isArray(product.addOns) ? product.addOns : []).map(
          (option) => ({
            name: option.name ?? {ar: "", en: ""},
            price: typeof option.price === "number" ? option.price : 0,
            isActive: option.isActive !== false,
            sortOrder: option.sortOrder ?? 0,
          })
        ),
      };
    }
    return {
      name: {ar: "", en: ""},
      slug: "",
      description: {ar: "", en: ""},
      category: "",
      price: 0,
      oldPrice: "",
      unitLabel: {ar: "", en: ""},
      isActive: true,
      isAvailable: true,
      isFeatured: false,
      sortOrder: 0,
      images: [{...emptyImage, isPrimary: true}],
      measuringUnit: {unitType: "", options: []},
      addOns: [],
    };
  }, [mode, product]);

  const schema = useMemo(
    () =>
      productSchema({
        required: t("validation.required"),
        invalidSlug: t("validation.invalidSlug"),
        invalidCategory: t("validation.invalidCategory"),
        minZero: t("validation.minZero"),
        unitTypeRequired: t("validation.unitTypeRequired"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({control, name: "images"});

  const generateSlug = () => {
    if (getValues("slug")) {
      return;
    }
    const slug = slugify(getValues("name.en"));
    if (slug) {
      setValue("slug", slug, {shouldValidate: true});
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    data.images = data.images.map((image) =>
      image.url
        ? {...image, alt: {ar: data.name.ar || "", en: data.name.en || ""}}
        : image
    );

    const endpoint =
      mode === "edit"
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";

    if (mode === "create") {
      data.hasMeasuringUnit = false;
      data.measuringUnit = {unitType: undefined, options: []};
    } else {
      const unitOptions = Array.isArray(data.measuringUnit?.options)
        ? data.measuringUnit.options
        : [];
      const hasMeasuringUnit = unitOptions.length > 0;
      data.hasMeasuringUnit = hasMeasuringUnit;
      data.measuringUnit = {
        unitType: hasMeasuringUnit
          ? (data.measuringUnit?.unitType || undefined)
          : undefined,
        options: hasMeasuringUnit ? unitOptions : [],
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        if (body?.error === "SLUG_EXISTS") {
          toast.error(t("errorSlugExists"));
        } else if (body?.error === "UNAUTHORIZED") {
          router.replace(`/${locale}/admin/login`);
        } else if (body?.error === "NOT_FOUND") {
          toast.error(t("errorNotFound"));
        } else {
          toast.error(t("errorGeneric"));
        }
        return;
      }

      toast.success(mode === "edit" ? t("successUpdate") : t("successCreate"));
      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch {
      toast.error(t("errorGeneric"));
    }
  });

  const sectionTitle = "text-sm font-semibold uppercase tracking-wide text-muted-foreground";

  return (
    <Card className="max-w-4xl shadow-soft">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} noValidate className="space-y-8">
          <div className="space-y-4">
            <h3 className={sectionTitle}>{t("sectionBasic")}</h3>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-name-ar">{t("labels.nameAr")}</Label>
                <Input
                  id="product-name-ar"
                  dir="rtl"
                  placeholder={t("placeholders.nameAr")}
                  aria-invalid={errors.name?.ar ? "true" : undefined}
                  aria-describedby={
                    errors.name?.ar ? "product-name-ar-error" : undefined
                  }
                  {...register("name.ar")}
                />
                <FieldError
                  id="product-name-ar-error"
                  message={errors.name?.ar?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-name-en">{t("labels.nameEn")}</Label>
                <Input
                  id="product-name-en"
                  dir="ltr"
                  placeholder={t("placeholders.nameEn")}
                  aria-invalid={errors.name?.en ? "true" : undefined}
                  aria-describedby={
                    errors.name?.en ? "product-name-en-error" : undefined
                  }
                  {...register("name.en")}
                  onBlur={(event) => {
                    register("name.en").onBlur(event);
                    generateSlug();
                  }}
                />
                <FieldError
                  id="product-name-en-error"
                  message={errors.name?.en?.message}
                />
              </div>
            </div>

            <input type="hidden" {...register("slug")} />

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-desc-ar">{t("labels.descriptionAr")}</Label>
                <Textarea
                  id="product-desc-ar"
                  dir="rtl"
                  placeholder={t("placeholders.descriptionAr")}
                  aria-invalid={errors.description?.ar ? "true" : undefined}
                  aria-describedby={
                    errors.description?.ar ? "product-desc-ar-error" : undefined
                  }
                  {...register("description.ar")}
                />
                <FieldError
                  id="product-desc-ar-error"
                  message={errors.description?.ar?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-desc-en">{t("labels.descriptionEn")}</Label>
                <Textarea
                  id="product-desc-en"
                  dir="ltr"
                  placeholder={t("placeholders.descriptionEn")}
                  aria-invalid={errors.description?.en ? "true" : undefined}
                  aria-describedby={
                    errors.description?.en ? "product-desc-en-error" : undefined
                  }
                  {...register("description.en")}
                />
                <FieldError
                  id="product-desc-en-error"
                  message={errors.description?.en?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-category">{t("labels.category")}</Label>
              <Select
                id="product-category"
                {...register("category")}
                aria-invalid={errors.category ? "true" : undefined}
                aria-describedby={
                  errors.category ? "product-category-error" : undefined
                }
              >
                <option value="">{t("placeholders.categorySelect")}</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name.en}
                    {item.name.ar ? ` — ${item.name.ar}` : ""}
                  </option>
                ))}
              </Select>
              <FieldError
                id="product-category-error"
                message={errors.category?.message}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-unit-ar">{t("labels.unitLabelAr")}</Label>
                <Input
                  id="product-unit-ar"
                  dir="rtl"
                  placeholder={t("placeholders.unitLabelAr")}
                  {...register("unitLabel.ar")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-unit-en">{t("labels.unitLabelEn")}</Label>
                <Input
                  id="product-unit-en"
                  dir="ltr"
                  placeholder={t("placeholders.unitLabelEn")}
                  {...register("unitLabel.en")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-8">
            <h3 className={sectionTitle}>{t("sectionPricing")}</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="product-price">{t("labels.price")}</Label>
                <Input
                  id="product-price"
                  dir="ltr"
                  type="number"
                  min="0"
                  step="0.5"
                  aria-invalid={errors.price ? "true" : undefined}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                  {...register("price")}
                />
                <FieldError id="product-price-error" message={errors.price?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-old-price">{t("labels.oldPrice")}</Label>
                <Input
                  id="product-old-price"
                  dir="ltr"
                  type="number"
                  min="0"
                  step="0.5"
                  aria-invalid={errors.oldPrice ? "true" : undefined}
                  aria-describedby={
                    errors.oldPrice ? "product-old-price-error" : undefined
                  }
                  {...register("oldPrice")}
                />
                <FieldError
                  id="product-old-price-error"
                  message={errors.oldPrice?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sort-order">{t("labels.sortOrder")}</Label>
                <Input
                  id="product-sort-order"
                  dir="ltr"
                  type="number"
                  min="0"
                  step="1"
                  aria-invalid={errors.sortOrder ? "true" : undefined}
                  aria-describedby={
                    errors.sortOrder ? "product-sort-order-error" : undefined
                  }
                  {...register("sortOrder")}
                />
                <FieldError
                  id="product-sort-order-error"
                  message={errors.sortOrder?.message}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...register("isActive")}
                />
                <span className="text-sm font-medium leading-none">
                  {t("labels.isActive")}
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...register("isAvailable")}
                />
                <span className="text-sm font-medium leading-none">
                  {t("labels.isAvailable")}
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...register("isFeatured")}
                />
                <span className="text-sm font-medium leading-none">
                  {t("labels.isFeatured")}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-8">
            <h3 className={sectionTitle}>{t("sectionImages")}</h3>

            <div className="space-y-4">
              {imageFields.map((image, imageIndex) => (
                <div
                  key={image.id}
                  className="space-y-3 rounded-2xl border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold tracking-tight">
                      {t("sectionImages")} #{imageIndex + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(imageIndex)}
                      className="h-8 w-8 px-0 text-muted-foreground hover:text-error"
                      aria-label={t("removeImage")}
                      title={t("removeImage")}
                    >
                      <Trash2 className="h-4 w-4 rtl:-scale-x-100" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <ImageUploadField
                      control={control}
                      name={`images.${imageIndex}`}
                      altFallback={t("imageAltFallback")}
                      disabled={isSubmitting || isSubmitSuccessful}
                      ariaDescribedBy={
                        errors.images?.[imageIndex]?.url
                          ? `image-${imageIndex}-error`
                          : undefined
                      }
                    />
                    <FieldError
                      id={`image-${imageIndex}-error`}
                      message={errors.images?.[imageIndex]?.url?.message}
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <PrimaryImageCheckbox
                      control={control}
                      name={`images.${imageIndex}.isPrimary`}
                      onMakePrimary={() => {
                        imageFields.forEach((_, otherIndex) => {
                          setValue(`images.${otherIndex}.isPrimary`, otherIndex === imageIndex);
                        });
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendImage({...emptyImage, sortOrder: imageFields.length})
                }
              >
                <Plus className="h-4 w-4" />
                {t("addImage")}
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-8">
            <h3 className={sectionTitle}>{mode === "edit" ? t("sectionOptions") : t("sectionOptionsCreate")}</h3>

            {mode === "edit" ? (
              <MeasuringUnitFields
                control={control}
                register={register}
                errors={errors}
              />
            ) : null}

            <AddOnFields control={control} register={register} errors={errors} />
          </div>

          <div className="sticky bottom-0 -mx-6 -mb-6 rounded-b-2xl border-t border-border bg-surface/95 p-6 pt-4 shadow-clay-md backdrop-blur-md sm:static sm:mx-0 sm:mb-0 sm:rounded-none sm:border-t-0 sm:bg-transparent sm:p-0 sm:pt-8 sm:shadow-none">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href={`/${locale}/admin/products`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-10"
              >
                {t("cancel")}
              </Link>
              <Button type="submit" disabled={isSubmitting} className="h-12 sm:h-10">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {mode === "edit" ? t("submitUpdate") : t("submitCreate")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}