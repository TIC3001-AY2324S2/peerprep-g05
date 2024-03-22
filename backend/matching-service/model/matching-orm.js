import { createFindMatchRecord } from "./repository.js"

export async function ormCreateFindMatchRecord(userId, level) {
  try {
    const newRecord = await createFindMatchRecord({ userId, level });
    await newRecord.save();
    return true;
  } catch (err) {
    console.log(err);
    return { err };
  }
}