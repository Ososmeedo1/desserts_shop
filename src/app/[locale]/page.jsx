import {getTranslations, setRequestLocale} from "next-intl/server";
import {HeroSection} from "@/components/storefront/home/HeroSection";
import {CategoriesSection} from "@/components/storefront/home/CategoriesSection";
import {FeaturedProductsSection} from "@/components/storefront/home/FeaturedProductsSection";
import {BrandStorySection} from "@/components/storefront/home/BrandStorySection";
import {WhyChooseUsSection} from "@/components/storefront/home/WhyChooseUsSection";
import {SocialSection} from "@/components/storefront/home/SocialSection";
import {ContactCTASection} from "@/components/storefront/home/ContactCTASection";
import {getActiveCategories} from "@/lib/data/categories";
import {
  getActiveProducts,
  getFeaturedProducts,
} from "@/lib/data/products";
import {getPublicSiteSettings} from "@/lib/data/settings";
import {seoAlternates} from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return [{locale: "ar"}, {locale: "en"}];
}

export async function generateMetadata({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    alternates: seoAlternates(locale, "/"),
  };
}

export default async function HomePage({params}) {
  const {locale} = await params;

  setRequestLocale(locale);

  const [featuredProducts, activeProducts, categories, settings] =
    await Promise.all([
      getFeaturedProducts(locale),
      getActiveProducts(locale),
      getActiveCategories(locale),
      getPublicSiteSettings(locale),
    ]);

  const heroImages = [...featuredProducts, ...activeProducts]
    .filter((product) => product.image?.url)
    .reduce((acc, product) => {
      if (acc.length >= 2 || acc.some((entry) => entry.url === product.image.url)) {
        return acc;
      }
      acc.push({url: product.image.url, alt: product.name});
      return acc;
    }, []);

  return (
    <div>
      <HeroSection heroImages={heroImages} />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <BrandStorySection />
      <WhyChooseUsSection />
      <SocialSection settings={settings} />
      <ContactCTASection settings={settings} />
    </div>
  );
}