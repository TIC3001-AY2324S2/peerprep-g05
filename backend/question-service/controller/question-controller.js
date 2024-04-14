import {
    ormFindAllQuestion as _findAllQuestion,
    ormFindQuestionByID as _findQuestionByID,
    ormFindOneQuestionByComplexity as _findOneQuestionByComplexity,
    ormCreateQuestion as _createQuestion,
    ormDeleteQuestion as _deleteQuestion,
    ormUpdateQuestion as _updateQuestion,
    ormFindAllQuestionByComplexity as _findAllQuestionByComplexity,
    ormFindAllCategoryByComplexity as _findAllCategoryByComplexity,
    ormFindOneQuestionByComplexityAndCategory as _findOneQuestionByComplexityAndCategory
} from "../model/question-orm.js";

export async function getAllQuestion(req, res) {
    const page = req.query.page;
    const limit = req.query.limit;
    console.log(`GET ${limit} QUESTIONS FOR PAGE ${page}`);

    const response = await _findAllQuestion();

    if (response === null) {
        return res.status(200).json({
            message: `No Question In Repository`,
            questions: []
        });
    } else if (response.err) {
        return res.status(400).json({message: "Error With Question Repository"});
    } else {
        console.log(`Questions loaded!`);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalPages = Math.ceil(response.length / limit);


        const slicedResponse = response.slice(startIndex, endIndex);
        return res.status(200).json({
            message: `Questions loaded!`,
            questions: slicedResponse,
            totalPages: totalPages,
        });
    }

}

export async function getQuestionById(req, res) {
    const id = req.params.id;
    console.log(`GET QUESTION BY ID: ${id}`);

    const response = await _findQuestionByID(id);

    if (response === null) {
        return res.status(404).json({
            message: `Question Not Found`
        });
    } else if (response.err) {
        return res.status(400).json({message: "Error With Question Repository"});
    } else {
        console.log(`Questions loaded!`);
        return res.status(200).json({
            message: `Questions loaded!`,
            question: response,
        });
    }
}

export async function getOneQuestionByComplexity(req, res) {
    const complexity = req.params.complexity;
    console.log(`GET A QUESITON OF COMPLEXITY : ${complexity}`);

    const response = await _findOneQuestionByComplexity(complexity);

    if (response === null) {
        return res.status(200).json({
            message: `Question Not Found`
        });
    } else if (response.err) {
        return res.status(400).json({message: "Error With Question Repository"});
    } else {
        console.log(`Questions loaded!`);
        return res.status(200).json({
            message: `Questions loaded!`,
            question: response,
        });
    }
}

export async function getOneRandomQuestionByComplexityAndCategory(req, res) {
    const complexity = req.params.complexity;
    const category = req.params.category;
    console.log(`GET A QUESITON OF COMPLEXITY : ${complexity} AND CATEGORY : ${category}`);

    const response = await _findOneQuestionByComplexityAndCategory(complexity,category);

    if (response === null) {
        return res.status(404).json({
            message: `Question Not Found`
        });
    } else if (response.err) {
        return res.status(400).json({message: "Error With Question Repository"});
    } else {
        console.log(`Questions loaded!`);
        return res.status(200).json({
            message: `Questions loaded!`,
            question: response,
        });
    }
}

export async function getAllQuestionByComplexity(req, res) {
    const complexity = req.params.complexity;
    console.log(`GET ALL QUESITON OF COMPLEXITY : ${complexity}`);

    const response = await _findAllQuestionByComplexity(complexity);

    if (response === null) {
        return res.status(200).json({
            message: `Question Not Found`
        });
    } else if (response.err) {
        return res.status(400).json({message: "Error With Question Repository"});
    } else {
        console.log(`Questions loaded!`);
        return res.status(200).json({
            message: `Questions loaded!`,
            question: response,
        });
    }
}

export async function getAllCategoryByComplexity(req, res) {
    const complexity = req.params.complexity;
    console.log(`GET ALL QUESITON CATEGORIES OF COMPLEXITY : ${complexity}`);

    const response = await _findAllCategoryByComplexity(complexity);

    if (response === null) {
        return res.status(404).json({
            message: `No Category Found For Given Complexity`
        });
    } else if (response.err) {
        return res.status(400).json({message: "Error With Question Repository"});
    } else {
        console.log(`Categories loaded!`);
        return res.status(200).json({
            message: `Categories loaded!`,
            categories: response,
        });
    }
}

export async function createQuestion(req, res) {
    try {
        const {title, description, categories, complexity, testCase} = req.body;
        const newQuestion = {title, description, categories, complexity, testCase}
        if (newQuestion) {
            console.log(`Adding new question: ${title}`);
            const resp = await _createQuestion(title, description, categories, complexity, testCase);
            if (resp.err) {
                console.log(resp.err.message);
                return res.status(409).json({
                    message:
                        "Could not create new question. Title already exists in repository!",
                });
            } else {
                console.log(`New question: ${title} added successfully!`);
                return res
                    .status(201)
                    .json({message: `New question: ${title} added successfully!`});
            }
        } else {
            return res.status(400).json({
                message: "Incomplete Question Data! Please provide all required fields!",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({message: "Database failure when creating new question!"});
    }
}

export async function deleteQuestionById(req, res) {
    try {
        const id = req.params.id;
        if (id) {
            console.log(`DELETE USER: question Obtained: ${id}`);
            const response = await _deleteQuestion(id);
            if (response.err) {
                return res.status(400).json({message: "Could not delete the question!"});
            } else if (!response) {
                console.log(`Question ${id} not found!`);
                return res
                    .status(404)
                    .json({message: `Question ${id} not found!`});
            } else {
                console.log(`Deleted Question ${id} successfully!`);
                return res
                    .status(200)
                    .json({message: `Deleted Question ${id} successfully!`});
            }
        } else {
            return res.status(400).json({
                message: "Question ID missing!",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({message: "Database failure when deleting question!"});
    }
}

export async function updateQuestionById(req, res) {
    try {
        const id = req.params.id;
        const {title, description, categories, complexity, testCase} = req.body;
        const questionInfo = {title, description, categories, complexity, testCase}
        if (questionInfo) {
            console.log(`Updating Question: ${id}`);
            const resp = await _updateQuestion(id, questionInfo);
            if (resp.err) {
                console.log(resp.err.message);
                return res
                    .status(409)
                    .json({message: "Could not update question. Title already exists in repository!"});
            } else {
                console.log("match " + resp.matchedCount, "modified " + resp.modifiedCount);
                if (resp.matchedCount === 0) {
                    console.log(`Question: ${id} not found!`);
                    return res
                        .status(404)
                        .json({message: `Question: ${id} not found!`});
                } else if (resp.modifiedCount === 0) {
                    console.log(`Question: ${id} not modified!`);
                    return res
                        .status(304)
                        .json({message: `Question: ${id} not modified!`});
                } else {
                    console.log(`Question: ${id} updated successfully!`);
                    return res
                        .status(200)
                        .json({message: `Question: ${id} updated successfully!`});
                }
            }
        } else {
            return res
                .status(400)
                .json({message: "Incomplete Question Data! Please provide all required fields!"});
        }

    } catch (err) {
        return res
            .status(500)
            .json({message: "Database failure when updating question!"});
    }
}