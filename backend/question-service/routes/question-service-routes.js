import express from "express";
const router = express.Router();
// import { verifyAccessToken, verifyIsAdmin } from "../middleware/basic-access-control.js";
import { getAllQuestion, getQuestionById, getOneQuestionByComplexity, createQuestion,
    //getTotalQuestionCount,
     deleteQuestionById, updateQuestionById } from "../controller/question-controller.js";

//return all question given active login + admin user
//router.get('/api/question/all', verifyAccessToken, verifyIsAdmin, getAllQuestion);
router.get('/api/question/all', getAllQuestion); //for testing

//return question by id
router.get('/api/question/:id', getQuestionById); 

//return one question of complexity
router.get('/api/question/complexity/:complexity', getOneQuestionByComplexity);

//create a single question and store in collection
router.post('/api/question/create', createQuestion);

//delete a single question by id
router.delete('/api/question/:id', deleteQuestionById);

//update a single question by id
router.patch('/api/question/:id', updateQuestionById);


export default router;