import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * Merges conditional Tailwind classes, resolving conflicts with tailwind-merge.
 *
 * @param {...(string | undefined | null | false | Record<string, unknown>)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}