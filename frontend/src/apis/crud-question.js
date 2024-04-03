import axios from "axios";

const HOST = process.env.DOCKER_QUESTION_SVC_URL || 'http://localhost:3002';

export function createOrUpdateQuestion(question) {
    // Send a POST request to the server to create a new question
    // using axios


    // real data
    // if id is not present, create a new question by calling post
    // if id is present, update the question by calling put

    let method = 'post';
    let url = `${HOST}/api/question/create`;
    console.log("question id", question.id)
    console.log("question", question)
    if (question.id) {
        method = 'patch';
        url = `${HOST}/api/question/${question.id}`;
    }

    return axios({
        method,
        url,
        data: question,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((resp) => ({data: resp.data, error: false}))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function deleteQuestion(id) {
    // Send a DELETE request to the server to delete a question
    // using axios

    // real data
    return axios
        .delete(`${HOST}/api/question/${id}`)
        .then((resp) => ({data: resp.data, error: false}))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function getQuestionById(id) {
    // Send a GET request to the server to get a question by id
    // using axios


    // real data
    return axios
        .get(`${HOST}/api/question/${id}`)
        .then((resp) => ({data: resp.data, error: false}))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function getQuestions(page, size) {
    // Send a GET request to the server to get all questions
    // using axios

    // real data
    return axios
        .get(`${HOST}/api/question/all?page=${page}&limit=${size}`)
        .then((resp) => ({data: resp.data, error: false}))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}