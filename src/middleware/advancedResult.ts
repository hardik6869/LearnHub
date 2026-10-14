import type { NextFunction, Request, Response } from "express";
import type { Model, PopulateOptions, QueryFilter } from "mongoose";

interface PageInfo {
  page: number;
  limit: number;
}

export interface Pagination {
  next?: PageInfo;
  prev?: PageInfo;
}

export interface AdvancedResults {
  success: true;
  count: number;
  pagination: Pagination;
  data: unknown[];
}

const advancedResults =
  <T>(model: Model<T>, populate?: string | PopulateOptions) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Copy req.query, excluding the select/sort/page/limit fields
    const { select, sort, page: pageParam, limit: limitParam, ...reqQuery } =
      req.query;

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    // The client-supplied filter, with operators rewritten above
    const filter = JSON.parse(queryStr) as QueryFilter<T>;

    // Finding resource
    let query = model.find(filter);

    // Select Fields
    if (typeof select === "string") {
      const fields = select.split(",").join(" ");
      query = query.select(fields);
    }

    if (typeof sort === "string") {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(typeof pageParam === "string" ? pageParam : "", 10) || 1;
    const limit =
      parseInt(typeof limitParam === "string" ? limitParam : "", 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const results: unknown[] = populate
      ? await query.populate([populate])
      : await query;

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
