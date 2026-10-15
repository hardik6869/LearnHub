import type { NextFunction, Request, Response } from "express";
import type { Model, PopulateOptions, QueryFilter } from "mongoose";
import type { Pagination } from "../types";

// Fields stored with `select: false`. Clients may neither select them (`?select=+password`) nor
// filter on them (`?password[gt]=…` would let a caller narrow down a hash character by character).
const HIDDEN_FIELDS = new Set(["password", "resetPasswordToken", "resetPasswordExpire"]);

// "+field" force-includes select:false fields, so it is never allowed from a client
const isAllowedSelectField = (field: string): boolean => {
  const name = field.replace(/^-/, "");
  return field !== "" && !field.startsWith("+") && !HIDDEN_FIELDS.has(name);
};

const advancedResults =
  <T>(model: Model<T>, populate?: string | PopulateOptions | PopulateOptions[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Copy req.query, excluding the select/sort/page/limit fields and any hidden field
    const { select, sort, page: pageParam, limit: limitParam, ...queryFields } = req.query;
    const reqQuery = Object.fromEntries(
      Object.entries(queryFields).filter(([key]) => !HIDDEN_FIELDS.has(key)),
    );

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // The client-supplied filter, with operators rewritten above. Nested routes
    // (/academies/:academyId/courses|reviews) are always limited to that academy.
    const { academyId } = req.params;
    const filter = {
      ...(JSON.parse(queryStr) as QueryFilter<T>),
      ...(academyId ? { academy: academyId } : {}),
    } as QueryFilter<T>;

    // Finding resource
    let query = model.find(filter);

    // Select Fields
    if (typeof select === "string") {
      const fields = select
        .split(",")
        .map((field) => field.trim())
        .filter(isAllowedSelectField);
      if (fields.length > 0) query = query.select(fields.join(" "));
    }

    if (typeof sort === "string") {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(typeof pageParam === "string" ? pageParam : "", 10) || 1;
    const limit = parseInt(typeof limitParam === "string" ? limitParam : "", 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Count only matching documents, so `next` is correct for filtered lists
    const total = await model.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    const populateList = Array.isArray(populate) ? populate : populate ? [populate] : [];
    const results: unknown[] =
      populateList.length > 0 ? await query.populate(populateList) : await query;

    const pagination: Pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };

export default advancedResults;
