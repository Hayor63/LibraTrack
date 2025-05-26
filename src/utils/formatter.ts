import mongoose from "mongoose";

export const formatResponseRecord = (record: any, recordType?: string): any => {
  if (typeof record !== "object" || !record) return record;

  // ✅ Convert MongoDB ObjectId to string
  if (record instanceof mongoose.Types.ObjectId) return record.toString();

  // ✅ Convert Date objects as-is
  if (record instanceof Date) return record;

  const formattedRecord = Object.keys(record).reduce<Record<string, any>>(
    (acc, key) => {
      const value = record[key];

      if (typeof value === "object" && value !== null && !/^_/.test(key)) {
        // ✅ Convert arrays recursively
        if (Array.isArray(value)) {
          acc[key] = value.map((item) => formatResponseRecord(item));
        }
        // ✅ Preserve referenced fields (e.g., bookId, authorId, genreId, publisherId)
        else if (["bookId", "genreId", "categoryId"].includes(key)) {
          acc[key] = formatResponseRecord(value);
        } else {
          acc[key] = formatResponseRecord(value);
        }
      }
      // Convert ObjectId inside objects
      else if (value instanceof mongoose.Types.ObjectId) {
        acc[key] = value.toString();
      }
      // Keep normal fields (except _id, __v)
      else if (!/^_/.test(key) || key === "_id") {
        acc[key] = value;
      }

      return acc;
    },
    {}
  );

  // Ensure consistent `id` field (using value from `_id`)
  formattedRecord.id =
    record._id instanceof mongoose.Types.ObjectId
      ? record._id.toString()
      : record._id || record.id;

  // Clean up the `_id` field from the formatted response
  delete formattedRecord._id;

  // Handle specific library record types with sorting logic
  switch (recordType) {
    case "book":
      return {
        ...formattedRecord,
        authors: formattedRecord.authors?.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        ),
      };
    case "genre":
      return {
        ...formattedRecord,
        books: formattedRecord.books?.sort((a: any, b: any) =>
          a.title.localeCompare(b.title)
        ),
      };
    default:
      return formattedRecord;
  }
};
