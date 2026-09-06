import mongoose from "mongoose";
import {loadEnv} from "./load-env.mjs";

function inferUnitType(group) {
  const haystacks = [];
  for (const option of group.options || []) {
    if (option?.name?.ar) haystacks.push(option.name.ar);
    if (option?.name?.en) haystacks.push(option.name.en);
  }
  const text = haystacks.join(" ").toLowerCase();

  const weightMarkers = [
    "كيلو", "نص كيلو", "ربع كيلو", "kg", "غ", "جرام", "جرام", "جم", "كجم",
  ];
  const sizeMarkers = [
    "مقاس", "حجم", "size", "سنتي", "cm", "عدد افراد", "يكفي", "serves",
  ];
  const piecesMarkers = ["قطعة", "pieces", "piece", "cup", "كوب", "بوكس"];

  const countMarker = (markers) =>
    markers.reduce((acc, marker) => acc + text.split(marker).length - 1, 0);

  const weight = countMarker(weightMarkers);
  const size = countMarker(sizeMarkers);
  const pieces = countMarker(piecesMarkers);

  if (size > weight && size >= pieces) {
    return "size";
  }
  if (weight > 0 && weight >= size && weight >= pieces) {
    return "weight";
  }
  if (pieces > 0) {
    return "pieces";
  }
  return "pieces";
}

async function main() {
  loadEnv();

  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    console.error("MONGODB_URI is not defined.");
    process.exit(1);
  }

  try {
    const {connectDB} = await import("../src/lib/db.js");
    await connectDB();

    const {Product} = await import("../src/models/Product.js");

    const all = await Product.find({}).lean();

    let migratedWithOptions = 0;
    let migratedAddonsOnly = 0;
    let untouched = 0;
    const log = [];

    for (const product of all) {
      const groups = Array.isArray(product.optionGroups) ? product.optionGroups : [];
      const variantGroups = groups.filter((group) => group?.type === "variant");
      const addonGroups = groups.filter((group) => group?.type === "addon");

      const hasLegacyVariant = variantGroups.length > 0;

      if (hasLegacyVariant || addonGroups.length > 0) {
        let measuringUnit;
        let hasMeasuringUnit = false;

        const variantGroup = variantGroups[0];

        if (variantGroup) {
          const options = (Array.isArray(variantGroup.options) ? variantGroup.options : [])
            .filter((option) => option && option.name)
            .map((option, index) => ({
              name: {ar: option.name?.ar ?? "", en: option.name?.en ?? ""},
              price: typeof option.price === "number" ? option.price : 0,
              isActive: option.isActive !== false,
              sortOrder: option.sortOrder ?? index,
            }));

          const unitType = inferUnitType(variantGroup);

          hasMeasuringUnit = options.length > 0;
          measuringUnit = {unitType, options};
        }

        const addOns = [];
        for (const group of addonGroups) {
          for (const option of Array.isArray(group.options) ? group.options : []) {
            if (!option || !option.name) continue;
            addOns.push({
              name: {ar: option.name?.ar ?? "", en: option.name?.en ?? ""},
              price: typeof option.price === "number" ? option.price : 0,
              isActive: option.isActive !== false,
              sortOrder: option.sortOrder ?? addOns.length,
            });
          }
        }

        await Product.updateOne(
          {_id: product._id},
          {
            $set: {
              hasMeasuringUnit,
              measuringUnit: measuringUnit ?? {unitType: "size", options: []},
              addOns,
              optionGroups: [],
            },
          }
        );

        log.push(
          `${product.slug}: unit=${hasMeasuringUnit} (${measuringUnit?.unitType ?? "-"}), ` +
            `unitOptions=${measuringUnit?.options?.length ?? 0}, addOns=${addOns.length}`
        );

        if (hasLegacyVariant) migratedWithOptions++;
        else migratedAddonsOnly++;
      } else {
        await Product.updateOne(
          {_id: product._id},
          {$set: {hasMeasuringUnit: false, measuringUnit: {unitType: "size", options: []}, addOns: []}}
        );
        untouched++;
        log.push(`${product.slug}: no legacy groups -> hasMeasuringUnit=false, addOns=[]`);
      }
    }

    console.log(log.join("\n"));

    const productsWithoutGroups = await Product.countDocuments({
      $or: [
        {optionGroups: {$exists: false}},
        {optionGroups: {$size: 0}},
      ],
    });

    console.log(`\nMigration summary:`);
    console.log(`  products with legacy option groups migrated: ${migratedWithOptions}`);
    console.log(`  products with addon-only groups migrated: ${migratedAddonsOnly}`);
    console.log(`  products already plain (reset new fields): ${untouched}`);
    console.log(`  total products: ${all.length}`);
    console.log(`  products now without optionGroups: ${productsWithoutGroups}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error(`Migration failed: ${error instanceof Error ? error.message : error}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

main();