/**
 * Grid column classes for a list of `count` cards: as many columns as there are items, up to
 * `max` (2 or 3), so a short list never leaves a row half empty. Phones always get one column.
 * Use with `grid grid-cols-1`. Full class names, so Tailwind can find them.
 */
export const getGridColumns = (count: number, max: 2 | 3 = 3): string => {
  if (count <= 1) return "";
  if (count === 2 || max === 2) return "sm:grid-cols-2";
  return "sm:grid-cols-2 lg:grid-cols-3";
};
