import {
  createFindMatchRecord,
  findIfMatchRecordExists,
  findMatchRecord,
  findMatchPartner,
  createRoom,
} from "./repository.js"

export async function ormCreateFindMatchRecord(userId, level, category) {
  try {
    const newRecord = await createFindMatchRecord({ userId, level, category});
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

export async function ormCreateRoom(userIds, level, category) {
  try {
    const newRoom = await createRoom({ userIds, level, category});
    await newRoom.save();
    return newRoom;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function ormGetMatchPartner(userId, level, category) {
  try {
    const response = await findMatchPartner(userId, level, category);
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

export async function ormUpdateMatchRecordRoomId(recordId, roomId) {
  try {
    const response = await findMatchRecord(recordId);
    if (response) {
      response.roomId = roomId;
      await response.save();
      return response;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return { err };
  }
}