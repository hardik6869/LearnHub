// The backend's default when an academy has no photo; the file does not exist
const NO_PHOTO = "no-photo.jpg";

/**
 * Resolves an academy `photo` to a URL: Cloudinary photos are stored as full URLs, local
 * uploads as a file name under /uploads. Returns null when there is no photo, so the caller
 * can render a placeholder.
 */
export const getPhotoUrl = (photo: string | undefined): string | null => {
  if (!photo || photo === NO_PHOTO) return null;
  if (/^https?:\/\//i.test(photo)) return photo;
  return `/uploads/${encodeURIComponent(photo)}`;
};
