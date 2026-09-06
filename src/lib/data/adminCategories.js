import mongoose from "mongoose";
import {connectDB} from "@/lib/db";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";

export async function getAdminCategories() {
  try {
    await connectDB();

    const categories = await Category.find({}).sort({sortOrder: 1, createdAt: -1}).lean();

    const activeProductsByCategory = await Product.aggregate([
      {$match: {isActive: true}},
      {$group: {_id: "$category", count: {$sum: 1}}},
    ]);

    const counts = new Map(
      activeProductsByCategory.map((entry) => [String(entry._id), entry.count])
    );

    return categories.map((category) => ({
      id: String(category._id),
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      activeProductsCount: counts.get(String(category._id)) || 0,
    }));
  } catch (error) {
    console.warn(
      `getAdminCategories: database unavailable (${error instanceof Error ? error.message : String(error)})`
    );
    return [];
  }
}

export function isValidCategoryId(id) {
  return mongoose.isValidObjectId(id);
}

export async function getAdminCategoryById(id) {
  if (!isValidCategoryId(id)) {
    return null;
  }

  try {
    await connectDB();

    const category = await Category.findById(id).lean();

    if (!category) {
      return null;
    }

    return {
      id: String(category._id),
      name: category.name,
      slug: category.slug,
      description: category.description ?? {ar: "", en: ""},
      image: category.image ?? {url: "", fileId: "", alt: {ar: "", en: ""}},
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder ?? 0,
    };
  } catch (error) {
    console.warn(
      `getAdminCategoryById: database unavailable (${error instanceof Error ? error.message : String(error)})`
    );
    return null;
  }
}