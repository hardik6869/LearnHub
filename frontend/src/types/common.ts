// MongoDB ObjectId as it arrives in JSON
export type Id = string;

// ISO 8601 date string as it arrives in JSON (e.g. createdAt)
export type IsoDateString = string;

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}
