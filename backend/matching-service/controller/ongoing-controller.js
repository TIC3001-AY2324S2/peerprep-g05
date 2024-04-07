import { ormGetRoom, ormDeleteRoom } from "../model/ongoing-orm.js";

export async function getRoom(req, res) {
    try {
        console.log(req.query.roomId)
        const roomId = req.query.roomId;
        if (roomId) {
            const roomResponse = await ormGetRoom(roomId);
            if (roomResponse) {
                return res.status(200).json({ message: "Room found!", room: roomResponse });
            } else {
                return res.status(404).json({ message: "Room not found!" });
            }
        } else {
            return res.status(400).json({ message: "Room ID is missing!" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Database failure when getting room!" });
    }
}

export async function deleteRoom(req, res) {
    try {
        const roomId = req.query.roomId;
        console.log(roomId);
        if (roomId) {
            const deleteResponse = await ormDeleteRoom(roomId);
            console.log(deleteResponse);
            if (deleteResponse) {
                return res.status(200).json({ message: "Room deleted!" });
            } else {
                return res.status(404).json({ message: "Room not found!" });
            }
        } else {
            return res.status(400).json({ message: "Room ID is missing!" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Database failure when deleting room!" });
    }
}