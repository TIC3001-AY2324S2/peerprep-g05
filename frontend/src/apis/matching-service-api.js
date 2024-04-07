import axios from 'axios';

const QUESTION_SVC_HOST = process.env.DOCKER_QUESTION_SVC_URL || 'http://localhost:3002';
const MATCHING_SVC_HOST = process.env.DOCKER_MATCHING_SVC_URL || 'http://localhost:3003';

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