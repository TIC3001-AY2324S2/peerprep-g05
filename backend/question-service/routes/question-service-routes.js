import express from "express";
const router = express.Router();
import { verifyAccessToken, verifyIsAdmin } from "../middleware/basic-access-control.js";
import {
    getAllQuestion, getQuestionById, getAllQuestionByComplexity,
    createQuestion, getAllCategoryByComplexity,
    //getTotalQuestionCount,getOneQuestionByComplexity,
    deleteQuestionById, updateQuestionById,
    getOneRandomQuestionByComplexityAndCategory
} from "../controller/question-controller.js";

//return all question given active login + admin user
router.get('/api/question/all', verifyAccessToken, verifyIsAdmin, getAllQuestion);
//router.get('/api/question/all', getAllQuestion); //for testing

//return question by id
router.get('/api/question/:id', verifyAccessToken, getQuestionById); 

//return one question of complexity (unused)
//router.get('/api/question/complexity/:complexity', verifyAccessToken, getOneQuestionByComplexity);

//return all question with complexity
router.get('/api/question/all/:complexity', verifyAccessToken, getAllQuestionByComplexity);

//return all categories of a given complexity
router.get('/api/question/categories/:complexity', verifyAccessToken, getAllCategoryByComplexity);

//return all question of a given complexity and category
router.get('/api/question/:complexity/:category', verifyAccessToken, getOneRandomQuestionByComplexityAndCategory);

//create a single question and store in collection
router.post('/api/question/create', verifyAccessToken, verifyIsAdmin, createQuestion);

//delete a single question by id
router.delete('/api/question/:id', verifyAccessToken, verifyIsAdmin, deleteQuestionById);

//update a single question by id
router.patch('/api/question/:id', verifyAccessToken, verifyIsAdmin, updateQuestionById);


export default router;