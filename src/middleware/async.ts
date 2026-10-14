import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

type AsyncRequestHandler<ReqBody, P> = (
  req: Request<P, unknown, ReqBody>,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const asyncHandler =
  <ReqBody = unknown, P = ParamsDictionary>(
    fn: AsyncRequestHandler<ReqBody, P>,
  ): RequestHandler<P, unknown, ReqBody> =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
