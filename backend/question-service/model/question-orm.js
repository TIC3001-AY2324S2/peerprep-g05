//for db itneraction
import {
    findQuestionByID,
    findAllQuestion,
    getTotalQuestionCount,
    findOneQuestionByComplexity,
    findAllQuestionByComplexity,
    createQuestion,
    deleteQuestion,
    updateQuestion
  } from "./repository.js";

export async function ormFindAllQuestion() {
  try {
    const result = await findAllQuestion();

    // Checking if question exist
    if (result.length !== 0) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not load questions from repository!");
    return { err };
  }
}

export async function ormFindQuestionByID(id) {
  try {
    const result = await findQuestionByID(id);

    // Checking if question exist
    if (result.length !== 0) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not load question from repository!");
    return { err };
  }
}

export async function ormFindOneQuestionByComplexity(complexity) {
  try {
    const result = await findOneQuestionByComplexity(complexity);

    // Checking if question exist
    if (result.length !== 0) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not load question from repository!");
    return { err };
  }
}

export async function ormFindAllQuestionByComplexity(complexity) {
  try {
    const result = await findAllQuestionByComplexity(complexity);

    // Checking if question exist
    if (result.length !== 0) {
      return result;
    }

    return null;
  } catch (err) {
    console.log("ERROR: Could not load question from repository!");
    return { err };
  }
}

export async function ormCreateQuestion(title, description, categories, complexity, testCase) {
  try {
    await createQuestion({ title, description, categories, complexity, testCase });
    return true;
  } catch (err) {
    console.log("ERROR: Could create question in repository!");
    return { err };
  }
}

export async function ormDeleteQuestion(id) {
  try {
    const result = await deleteQuestion(id);

    // Checking if User existed
    if (result.deletedCount === 0) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("ERROR: Could not delete question");
    return { err };
  }
}

export async function ormUpdateQuestion(id, questionInfo){
  try {
    const result = await updateQuestion (id, questionInfo);
    return result;
  } catch (err) {
    console.log("ERROR: Could not update question");
    return { err };
  }
}