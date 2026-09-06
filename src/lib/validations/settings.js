import {z} from "zod";

export const SETTINGS_MESSAGES = {
  invalidUrl: "Please enter a valid URL starting with http:// or https://.",
  invalidCoordinate: "Please enter a valid coordinate in range.",
};

function isImageUrl(value) {
  return !value || /^(?:https?:\/\/|\/)/i.test(value);
}

const optionalString = z.string().trim();

function optionalCoordinate(min, max, messages = SETTINGS_MESSAGES) {
  return z
    .union([z.number(), z.string().trim(), z.null(), z.undefined()])
    .refine(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return true;
        }
        const num = typeof value === "number" ? value : Number(value);
        return Number.isFinite(num) && num >= min && num <= max;
      },
      ({path}) => ({
        message: messages.invalidCoordinate,
        path,
      })
    )
    .transform((value) => {
      if (value === "" || value === null || value === undefined) {
        return value;
      }
      return typeof value === "number" ? value : Number(value);
    });
}

export function settingsSchema(messages = SETTINGS_MESSAGES) {
  return z.object({
    brandName: z.object({
      ar: optionalString,
      en: optionalString,
    }),
    logo: z.object({
      url: optionalString.refine(isImageUrl, messages.invalidUrl),
      fileId: z.string().optional(),
      alt: z.object({
        ar: optionalString,
        en: optionalString,
      }),
    }),
    favicon: z.object({
      url: optionalString.refine(isImageUrl, messages.invalidUrl),
      fileId: z.string().optional(),
      alt: z.object({
        ar: optionalString,
        en: optionalString,
      }),
    }),
    phone: optionalString,
    whatsapp: optionalString,
    instagram: optionalString,
    facebook: optionalString,
    address: z.object({
      ar: optionalString,
      en: optionalString,
    }),
    openingHours: z.object({
      ar: optionalString,
      en: optionalString,
    }),
    contactMessage: z.object({
      ar: optionalString,
      en: optionalString,
    }),
    mapEmbedUrl: z
      .union([z.string().trim(), z.null(), z.undefined()])
      .optional()
      .refine((value) => !value || /^https?:\/\//i.test(value), messages.invalidUrl),
    mapUrl: z
      .union([z.string().trim(), z.null(), z.undefined()])
      .optional()
      .refine((value) => !value || /^https?:\/\//i.test(value), messages.invalidUrl),
    mapLatitude: optionalCoordinate(-90, 90).optional(),
    mapLongitude: optionalCoordinate(-180, 180).optional(),
  });
}
