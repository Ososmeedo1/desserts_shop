import {connectDB} from "@/lib/db";
import {SiteSettings} from "@/models/SiteSettings";

const EMPTY_SETTINGS = {
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
  mapEmbedUrl: "",
  mapUrl: "",
  mapLatitude: null,
  mapLongitude: null,
};

export async function getAdminSettings() {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne({singletonKey: "site"}).lean();

    if (!settings) {
      return EMPTY_SETTINGS;
    }

    return {
      brandName: settings.brandName ?? {ar: "", en: ""},
      logo: settings.logo ?? {url: "", fileId: "", alt: {ar: "", en: ""}},
      favicon: settings.favicon ?? {url: "", fileId: "", alt: {ar: "", en: ""}},
      phone: settings.phone ?? "",
      whatsapp: settings.whatsapp ?? "",
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      address: settings.address ?? {ar: "", en: ""},
      openingHours: settings.openingHours ?? {ar: "", en: ""},
      contactMessage: settings.contactMessage ?? {ar: "", en: ""},
      mapEmbedUrl: settings.mapEmbedUrl ?? "",
      mapUrl: settings.mapUrl ?? "",
      mapLatitude: settings.mapLatitude ?? null,
      mapLongitude: settings.mapLongitude ?? null,
    };
  } catch (error) {
    console.warn(
      `getAdminSettings: database unavailable (${error instanceof Error ? error.message : String(error)})`
    );
    return EMPTY_SETTINGS;
  }
}
