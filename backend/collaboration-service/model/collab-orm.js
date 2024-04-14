import {
    findSessionInfoByHash,
    addSessionInfo,
    deleteSession
} from "./repository.js";

export async function ormFindSessionInfoByHash (hash) {
    try {
        const result = await findSessionInfoByHash(hash);
    
        // Checking if question exist
        if (result.length !== 0) {
          return result;
        }
    
        return null;
      } catch (err) {
        console.log("ERROR: Could not load session info from repository!");
        return { err };
      }
}

export async function ormAddSessionInfo (hash , questionid) {
    try {
        await addSessionInfo( hash , questionid );
        return true;
      } catch (err) {
        console.log("ERROR: Could not add session info in repository!");
        return { err };
      }
}

export async function ormDeleteSessionByHash (hash) {
    try {
        const result = await deleteSession(hash);
        if (result.deletedCount === 0) {
          return false;
        }
        return true;
      } catch (err) {
        console.log("ERROR: Could not delete session info in repository!");
        return { err };
      } 
}
