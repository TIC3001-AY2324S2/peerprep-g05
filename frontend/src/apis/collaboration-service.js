import axios from "axios";

const HOST = process.env.DOCKER_COLLABORATION_SVC_URL || 'http://localhost:3004';

export function getCollaborationQuestionsById(id) {
    // Send a GET request to the server to get a question by id
    // using axios

    // real data
    return axios
        .get(`${HOST}/api/collaboration/${id}`)
        .then((resp) => ({data: resp.data, error: false}))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

