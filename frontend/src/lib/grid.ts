// Fixed grids, so every card has the same width whatever the count (one academy is one normal
// card, not a full-width one) and every row the same height (auto-rows-fr). Phones get one
// column. Full class names, so Tailwind can find them.

/** Academies and courses: 1 / 2 / 3 columns */
export const CARD_GRID = "grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

/** Reviews are text-heavy: 1 / 2 columns */
export const REVIEW_GRID = "grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2";
