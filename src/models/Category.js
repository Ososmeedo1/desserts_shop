import mongoose from "mongoose";
import {localizedString} from "./utils.js";

const categorySchema = new mongoose.Schema(
  {
    name: localizedString({required: true}),
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be kebab-case (e.g. chocolate-cake)",
      ],
    },
    description: localizedString(),
    image: {
      url: {type: String, trim: true},
      fileId: {type: String, trim: true},
      alt: localizedString(),
      _id: false,
    },
    isActive: {type: Boolean, default: true},
    sortOrder: {type: Number, default: 0},
  },
  {timestamps: true}
);

categorySchema.index({slug: 1}, {unique: true});
categorySchema.index({isActive: 1});
categorySchema.index({sortOrder: 1});
categorySchema.index({isActive: 1, sortOrder: 1});

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);