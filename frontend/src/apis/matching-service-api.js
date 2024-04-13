import axios from 'axios';
import mqtt from 'mqtt';

const QUESTION_SVC_HOST = process.env.REACT_APP_DOCKER_QUESTION_SVC_URL || 'http://localhost:3002';
const MATCHING_SVC_HOST = process.env.REACT_APP_DOCKER_MATCHING_SVC_URL || 'http://localhost:3003';
const MATCHING_BROKER_SVC_HOST = process.env.REACT_APP_DOCKER_MATCHING_BROKER_SVC_URL || 'ws://test.mosquitto.org:9001';

console.log(process.env);

const CONTENT_TYPE_JSON = 'application/json';

export function getCategoriesByComplexity(complexity) {
    return axios
        .get(`${QUESTION_SVC_HOST}/api/question/categories/${complexity}`, {
            headers: {
                Accept: CONTENT_TYPE_JSON,
            },
        })
        .then((resp) => ({ data: resp.data, error: false }))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function getQuestionsByCategory(complexity, category) {
    return axios
        .get(`${QUESTION_SVC_HOST}/api/question/complexity/${complexity}/category/${category}`, {
            headers: {
                Accept: CONTENT_TYPE_JSON,
            },
        })
        .then((resp) => ({ data: resp.data, error: false }))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function startMatch(username, email, complexity, category) {
    return axios
        .post(`${MATCHING_SVC_HOST}/api/match/start`, {
            username,
            email,
            complexity,
            category,
        })
        .then((resp) => ({ data: resp.data, error: false }))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function cancelMatch(username, email, complexity, category) {
    return axios
        .post(`${MATCHING_SVC_HOST}/api/match/cancel`, {
            username,
            email,
            complexity,
            category,
        })
        .then((resp) => ({ data: resp.data, error: false }))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function subscribeToTopic(username) {
    const client = mqtt.connect(MATCHING_BROKER_SVC_HOST);
    client.on('connect', () => {
        console.log(new Date().toLocaleString() + ': Connected to MQTT broker');
        client.subscribe('user/' + username, function (err) {
            if (!err) {
              console.log(new Date().toLocaleString() + ': Successfully subscribed to topic: user/' + username);
            } else {
              console.log('Error subscribing to topic: ', err);
            }
        });
    });
    return client;
}

export function getMatchHistory(email, page) {
    return axios
        .get(`${MATCHING_SVC_HOST}/api/match/history/${email}?page=${page}&limit=8`)
        .then((resp) => ({ data: resp.data, error: false }))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}