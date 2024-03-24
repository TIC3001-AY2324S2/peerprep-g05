import { findRoom } from "./repository.js";

export async function ormGetRoom(roomId) {
    try {
        const response = await findRoom(roomId);
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

export async function ormDeleteRoom(roomId) {
    try {
        const response = await findRoom(roomId);
        console.log(response);
        if (response) {
            response.isActive = false;
            await response.save();
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return { err };
    }
}