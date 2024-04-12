import {
    ormFindSessionInfoByHash as _findSessionInfoByHash,
    ormAddSessionInfo as _addSessionInfo 
} from "../model/collab-orm.js";

console.log("CONTROLLER");

export async function getSessionInfoByHash(req, res) {
    const hash = req.params.hash;
    console.log("SEARCHING FOR SESSION INFO WITH HASH")

    const response = await _findSessionInfoByHash(hash);

    console.log(response);

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
            console.log(resp);
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