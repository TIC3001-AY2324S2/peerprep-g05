import {
  createMatchRecordForUser,
  findMatchesForUser,
  findMatchForUser,
} from "./repository.js"

export async function ormGetMatchesForUser(email) {
  try {
    const matches = await findMatchesForUser(email);
    return matches;
  } catch (err) {
    console.log(`Error ormGetMatchesForUser: ${err}`);
    return { err };
  }
}

export async function ormCreateMatchRecordForUser(hash, email, partner, complexity, category) {
  try {
    await createMatchRecordForUser(hash, email, partner, complexity, category);
    return true;
  } catch (err) {
    console.log(`Error ormCreateMatchRecordForUser: ${err}`);
    return { err };
  }
}

export async function ormGetMatchForUser(email, hash) {
  try {
    const match = await findMatchForUser(email, hash);
    return match;
  } catch (err) {
    console.log(`Error ormGetMatchForUser: ${err}`);
    return { err };
  }
}