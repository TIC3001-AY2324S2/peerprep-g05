import axios from 'axios';

const HOST = 'http://localhost:3002';

export function getCategoriesByComplexity(token, complexity) {
    return axios
        .get(`${HOST}/api/question/categories/${complexity}`, {
            headers: {
                authorization: token,
            },
        })
        .then((resp) => ({ data: resp.data, error: false }))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}

export function getQuestionsByCategory(token, complexity, category) {
    return axios
        .get(`${HOST}/api/question/${complexity}/${category}`, {
            headers: {
                authorization: token,
            },
        })
        .then((resp) => ({ data: resp.data, error: false }))
        .catch((err) => ({
            data: err && err.response ? err.response.data : '',
            error: true,
            status: err && err.response ? err.response.status : '',
        }));
}