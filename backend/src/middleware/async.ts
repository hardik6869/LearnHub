import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { AsyncRequestHandler } from "../types";

const asyncHandler =
  <ReqBody = unknown, P = ParamsDictionary>(
    fn: AsyncRequestHandler<ReqBody, P>,
  ): RequestHandler<P, unknown, ReqBody> =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
