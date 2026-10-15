// express-xss-sanitizer@2 ships no type declarations
declare module "express-xss-sanitizer" {
  import type { RequestHandler } from "express";

  export interface XssSanitizerOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedKeys?: string[];
    maxDepth?: number;
  }

  export function xss(options?: XssSanitizerOptions): RequestHandler;
  export function sanitize<T>(data: T, options?: XssSanitizerOptions): T;
}
