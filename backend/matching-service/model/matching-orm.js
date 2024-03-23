import {
  createFindMatchRecord,
  findIfMatchRecordExists,
  findMatchRecord
} from "./repository.js"

export async function ormCreateFindMatchRecord(userId, level) {
  try {
    const newRecord = await createFindMatchRecord({ userId, level });
    await newRecord.save();
    return newRecord;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function ormfindIfMatchRecordExists(userId, createdAt) {
  try {
    const response = await findIfMatchRecordExists(userId, createdAt);
    console.log(response);
    if (response) {
      return response;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function ormGetMatchRecord(recordId) {
  try {
    const response = await findMatchRecord(recordId);
    if (response) {
      return response;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return { err };
  }
}