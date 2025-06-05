import mongoose, { Document } from "mongoose";

export function isSubsetById(
  mainArray: mongoose.Types.ObjectId[],
  idArray: string[]
): boolean {
  const idSet = new Set(mainArray.map((user) => user._id.toString()));
  return idArray.every((id) => idSet.has(id));
}
