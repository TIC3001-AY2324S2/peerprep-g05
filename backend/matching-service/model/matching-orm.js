import {
  createMatchRecordForUser,
  findMatchesForUser,
} from "./repository.js"

export async function ormGetMatchesForUser(email) {
  try {
    const matches = await findMatchesForUser(email);
    console.log(`email [${email}]:` + matches);
    return matches;
  } catch (err) {
    console.log(`Error ormGetMatchesForUser: ${err}`);
    return { err };
  }
}

export async function ormCreateMatchRecordForUser(email, partner, complexity, category) {
  try {
    await createMatchRecordForUser(email, partner, complexity, category);
    return true;
  } catch (err) {
    console.log(`Error ormCreateMatchRecordForUser: ${err}`);
    return { err };
  }
}