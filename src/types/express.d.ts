import type { AdvancedResults, UserDocument } from "./index";

declare global {
  namespace Express {
    interface Request {
      // Set by `protect`; null when the token's user no longer exists
      user?: UserDocument | null;
    }
    interface Response {
      // Set by the `advancedResults` middleware
      advancedResults?: AdvancedResults;
    }
  }
}

export {};
