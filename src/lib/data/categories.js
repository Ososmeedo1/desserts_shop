import {cache} from "react";
import {connectDB} from "@/lib/db";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import {localizeField} from "@/lib/catalog";
import {toSummaryView} from "@/lib/data/products";

/**
 * Server-side list of active categories for the storefront, sorted by
 * sortOrder ascending.
 *
 * Returns plain, serializable category view objects ({slug, name,
 * description, image}) or an empty array when the database is unavailable or
 * there are no active categories. Never throws.
 */
export const getActiveCategories = cache(async function getActiveCategories(locale) {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  try {
    await connectDB();

    const docs = await Category.find({isActive: true})
      .sort({sortOrder: 1, createdAt: -1})
      .lean();

    return docs.map((category) => {
      const name = localizeField(category.name, locale);
      return {
        slug: category.slug,
        name,
        description: localizeField(category.description, locale),
        image: category.image?.url
          ? {
              url: category.image.url,
              alt: localizeField(category.image.alt, locale) ?? name,
            }
          : null,
      };
    });
  } catch (error) {
    console.warn(
      `getActiveCategories: database unavailable, returning empty list (${
        error instanceof Error ? error.message : String(error)
      })`
    );
    return [];
  }
});

/**
 * Server-side category lookup for a storefront slug. Only active categories
 * are returned.
 *
 * Returns a plain, serializable category view (localized name, description and
 * image) or null when the category is not found or the database is
 * unavailable. Never throws.
 */
export const getCategoryBySlug = cache(async function getCategoryBySlug(slug, locale) {
  if (!process.env.MONGODB_URI || !slug) {
    return null;
  }

  try {
    await connectDB();

    const category = await Category.findOne({slug, isActive: true}).lean();

    if (!category) {
      return null;
    }

    const name = localizeField(category.name, locale);

    return {
      slug: category.slug,
      name,
      description: localizeField(category.description, locale),
      image: category.image?.url
        ? {
            url: category.image.url,
            alt: localizeField(category.image.alt, locale) ?? name,
          }
        : null,
    };
  } catch (error) {
    console.warn(
      `getCategoryBySlug: database unavailable, returning null (${
        error instanceof Error ? error.message : String(error)
      })`
    );
    return null;
  }
});

/**
 * Server-side active products for a category (by category slug), sorted by
 * sortOrder ascending then createdAt descending, matching the products
 * listing view shape.
 *
 * Returns an array of summary view objects or an empty array when the
 * database is unavailable or the category does not exist. Never throws.
 */
export const getProductsByCategory = cache(async function getProductsByCategory(
  categorySlug,
  locale
) {
  if (!process.env.MONGODB_URI || !categorySlug) {
    return [];
  }

  try {
    await connectDB();

    const category = await Category.findOne({
      slug: categorySlug,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!category) {
      return [];
    }

    const docs = await Product.find({isActive: true, category: category._id})
      .sort({sortOrder: 1, createdAt: -1})
      .populate({path: "category", select: "name slug"})
      .lean();

    return docs.map((product) => toSummaryView(product, locale));
  } catch (error) {
    console.warn(
      `getProductsByCategory: database unavailable, returning empty list (${
        error instanceof Error ? error.message : String(error)
      })`
    );
    return [];
  }
});