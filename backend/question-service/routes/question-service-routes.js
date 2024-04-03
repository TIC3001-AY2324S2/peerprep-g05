import express from "express";
const router = express.Router();
import { verifyAccessToken, verifyIsAdmin } from "../middleware/basic-access-control.js";
import { getAllQuestion, getQuestionById, getOneQuestionByComplexity, createQuestion,
    //getTotalQuestionCount,
     deleteQuestionById, updateQuestionById } from "../controller/question-controller.js";

//return all question given active login + admin user
router.get('/api/question/all', verifyAccessToken, verifyIsAdmin, getAllQuestion);
//router.get('/api/question/all', getAllQuestion); //for testing

//return question by id
router.get('/api/question/:id', verifyAccessToken, getQuestionById); 

//return one question of complexity
router.get('/api/question/complexity/:complexity', verifyAccessToken, getOneQuestionByComplexity);

//create a single question and store in collection
router.post('/api/question/create', verifyAccessToken, verifyIsAdmin, createQuestion);

//delete a single question by id
router.delete('/api/question/:id', verifyAccessToken, verifyIsAdmin, deleteQuestionById);

//update a single question by id
router.patch('/api/question/:id', verifyAccessToken, verifyIsAdmin, updateQuestionById);


export default router;