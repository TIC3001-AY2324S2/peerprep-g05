import {
    ormFindSessionInfoByHash as _findSessionInfoByHash,
    ormAddSessionInfo as _addSessionInfo,
    ormDeleteSessionByHash as _deleteSessionByHash
} from "../model/collab-orm.js";


export async function getSessionInfoByHash(req, res) {
    const hash = req.params.hash;
    console.log("SEARCHING FOR SESSION INFO WITH HASH")

    const response = await _findSessionInfoByHash(hash);

    if (response === null) {
        return res.status(404).json({
            message: `Session Not Found`
        });
    } else if (response.err) {
        return res.status(400).json({message: "Error With Question Repository"});
    } else {
        console.log(`Session Info loaded!`);
        return res.status(200).json({
            message: `Session Info loaded!`,
            question: response,
        });
    }
}

export async function addSessionInfo(req, res) {
    try {
        console.log(`ADDING NEW SESSION`);
        const newSession = {
            hash: req.params.hash,
            questionid: req.params.qid
        };
        if (newSession.hash && newSession.questionid) {
            const resp = await _addSessionInfo (newSession.hash, newSession.questionid);
            if (resp.err) {
                console.log(resp.err.message);
                return res.status(409).json({
                    message:
                        "Could not create new session. Hash already exists in repository!",
                });
            } else {
                console.log(`New session added successfully!`);
                return res
                    .status(201)
                    .json({message: `New session added successfully!`});
            }
        } else {
            return res.status(400).json({
                message: "Incomplete input! Please provide both session hash and question id!",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({message: "Database failure when adding new session!"});
    }
}

export async function deleteSessionInfoByHash(req, res) {
    try {
        const hash = req.params.hash;
        if (hash) {
            console.log(`DELETING SESSION : ${hash}`);
            const response = await _deleteSessionByHash(hash);
            if (response.err) {
                return res.status(400).json({message: "Could not delete the session!"});
            } else if (!response) {
                console.log(`Session ${hash} not found!`);
                return res
                    .status(404)
                    .json({message: `Session ${hash} not found!`});
            } else {
                console.log(`Deleted session ${hash} successfully!`);
                return res
                    .status(200)
                    .json({message: `Deleted session ${hash} successfully!`});
            }
        } else {
            return res.status(400).json({
                message: "Session Hash missing!",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({message: "Database failure when deleting question!"});
    }
}