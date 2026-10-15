const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export const formatCurrency = (amount: number): string => currencyFormatter.format(amount);

export const formatDate = (isoDate: string): string => dateFormatter.format(new Date(isoDate));

// Ratings are 1–10; academies without reviews have no averageRating
export const formatRating = (rating: number | undefined): string =>
  rating === undefined ? "No ratings" : `${rating.toFixed(1)} / 10`;
