/** A colour from the theme's palette, for icon chips and other small accents */
export type Tone = "primary" | "success" | "warning" | "info";

/**
 * Background + text classes for a tinted icon chip. Every pair meets 4.5:1 (see the ratios in
 * styles/globals.css), but the chip stays decorative: a label next to it carries the meaning.
 */
export const TONE_CHIP_CLASSES: Record<Tone, string> = {
  primary: "bg-accent text-primary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  info: "bg-info-muted text-info",
};
