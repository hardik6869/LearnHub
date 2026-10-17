import type { PipelineStage, QueryFilter } from "mongoose";
import { CAREERS, MINIMUM_SKILLS, USER_ROLES } from "../config/enums";
import asyncHandler from "../middleware/async";
import { getAuthUser } from "../middleware/auth";
import Academy from "../models/Academy";
import Course from "../models/Course";
import Review from "../models/Review";
import User from "../models/User";
import type { CountItem, DashboardStats, UserDocument } from "../types";

const MONTHS = 6;
const RATINGS = Array.from({ length: 10 }, (_, index) => String(index + 1));

interface Bucket {
  _id: string | number;
  count: number;
}

// Filters for the data a role may see. Each $match uses ObjectIds, as aggregate doesn't cast.
interface Scope {
  academy: QueryFilter<unknown>;
  course: QueryFilter<unknown>;
  review: QueryFilter<unknown>;
}

// Admins see everything; publishers their academies; students the reviews they wrote (and the
// academies they reviewed)
const getScope = async (user: UserDocument): Promise<Scope> => {
  if (user.role === "admin") return { academy: {}, course: {}, review: {} };

  const isPublisher = user.role === "publisher";
  const academyIds = isPublisher
    ? await Academy.distinct("_id", { user: user._id })
    : await Review.distinct("academy", { user: user._id });
  const inAcademies = { academy: { $in: academyIds } };

  return {
    academy: { _id: { $in: academyIds } },
    course: inAcademies,
    review: isPublisher ? inAcademies : { user: user._id },
  };
};

// Counts documents per value of `key` (a "$field" path or an expression)
const groupBy = (key: unknown): PipelineStage.Group => ({
  $group: { _id: key, count: { $sum: 1 } },
});

// One item per label in a fixed order, so charts keep their categories when a count is 0
const fillCounts = (labels: readonly string[], buckets: Bucket[]): CountItem[] => {
  const counts = new Map(buckets.map((bucket) => [String(bucket._id), bucket.count]));
  return labels.map((label) => ({ label, count: counts.get(label) ?? 0 }));
};

const sumCounts = (items: CountItem[]): number => items.reduce((sum, item) => sum + item.count, 0);

// The first day of the oldest month and the "YYYY-MM" labels (UTC, like $dateToString)
const getLastMonths = () => {
  const now = new Date();
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS - 1), 1));
  const labels = Array.from({ length: MONTHS }, (_, index) =>
    new Date(Date.UTC(since.getUTCFullYear(), since.getUTCMonth() + index, 1))
      .toISOString()
      .slice(0, 7),
  );
  return { since, labels };
};

// @desc   Dashboard KPIs and chart data for the signed-in user's role
// @route  GET /api/v1/stats
// @access Private
export const getStats = asyncHandler(async (req, res) => {
  const user = getAuthUser(req);
  const isAdmin = user.role === "admin";
  const scope = await getScope(user);
  const months = getLastMonths();

  const [academies, courses, careers, skills, ratings, reviewMonths, tuition, roles] =
    await Promise.all([
      Academy.countDocuments(scope.academy),
      Course.countDocuments(scope.course),
      Academy.aggregate<Bucket>([
        { $match: scope.academy },
        { $unwind: "$careers" },
        groupBy("$careers"),
      ]),
      Course.aggregate<Bucket>([{ $match: scope.course }, groupBy("$minimumSkill")]),
      Review.aggregate<Bucket>([{ $match: scope.review }, groupBy("$rating")]),
      Review.aggregate<Bucket>([
        { $match: { ...scope.review, createdAt: { $gte: months.since } } },
        groupBy({ $dateToString: { format: "%Y-%m", date: "$createdAt" } }),
      ]),
      Course.aggregate<{ average: number }>([
        { $match: scope.course },
        { $group: { _id: null, average: { $avg: "$tuition" } } },
      ]),
      isAdmin ? User.aggregate<Bucket>([groupBy("$role")]) : Promise.resolve([]),
    ]);

  const ratingCounts = fillCounts(RATINGS, ratings);
  const reviews = sumCounts(ratingCounts);
  const ratingSum = ratingCounts.reduce((sum, item) => sum + Number(item.label) * item.count, 0);
  const usersByRole = isAdmin ? fillCounts(USER_ROLES, roles) : [];

  const stats: DashboardStats = {
    totals: {
      users: isAdmin ? sumCounts(usersByRole) : null,
      academies,
      courses,
      reviews,
      averageRating: reviews > 0 ? ratingSum / reviews : null,
      averageTuition: tuition[0]?.average ?? null,
    },
    usersByRole,
    academiesByCareer: fillCounts(CAREERS, careers),
    coursesBySkill: fillCounts(MINIMUM_SKILLS, skills),
    ratings: ratingCounts,
    reviewsByMonth: fillCounts(months.labels, reviewMonths),
  };

  res.status(200).json({ success: true, data: stats });
});
