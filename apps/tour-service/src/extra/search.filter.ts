/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FilterQuery, Query } from "mongoose";

export default class SearchFilter<T> {
  //mongooseQuery is from mongodb
  //queryString is from req.query/query params
  constructor(
    public mongooseQuery: Query<T[], T>,
    private readonly queryString: Record<string, any>,
  ) {}

  filter(): this {
    const queryObj: Record<string, any> = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr) as Record<string, any>;

    const searchQuery: FilterQuery<T> = {};

    if (queryObj.searchField && queryObj.q) {
      const searchField = queryObj.searchField as keyof T;
      const searchTerm = queryObj.q as string;

      if (typeof searchField === "string") {
        searchQuery[searchField] = {
          $regex: searchTerm,
          $options: "i",
        };
      }
      delete parsedQuery.q;
      delete parsedQuery.searchField;
    }

    this.mongooseQuery = this.mongooseQuery.find({
      ...searchQuery,
      ...parsedQuery,
    });
    return this;
  }

  sort(): this {
    if (this.queryString?.sort) {
      const sortBy = this.queryString?.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  fields(): this {
    if (this.queryString?.fields) {
      const fields = this.queryString?.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate(): this {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const maxLimit = 1000;
    const limit = Math.min(
      Math.max(Number(this.queryString.limit) || 100, 1),
      maxLimit,
    );
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}
