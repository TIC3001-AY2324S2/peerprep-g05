import {useState, useEffect, useCallback} from "react";
import {getQuestionById, getQuestions} from "../../apis/crud-question";
import {useParams} from "react-router-dom";
import './CollabComponent.scss';


export default function MatchingQuestion(props) {
    const {id: pathId} = useParams();
    // const qId = pathId || props.id;
    const qId = 5;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [testCases, setTestCases] = useState([{input: '', result: ''}]);
    const [setQuestions] = useState([]);
    const {isVerifyDone} = props;

    const refreshQuestions = useCallback(() => {
        if (!isVerifyDone) {
            return;
        }

        try {
            console.log("refreshQuestions")
            getQuestionById(qId)
                .then(resp => {
                    if (resp.error) {
                        console.error('Failed to fetch question:', resp.error);
                        return;
                    }
                    console.log("get question by id", resp.data)
                    let data = resp.data.question;
                    setTitle(data.title);
                    setDescription(data.description);
                    setTestCases(data.testCase || []);
                });
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    }, [isVerifyDone]);

    useEffect(() => {
        refreshQuestions();
    }, [refreshQuestions]);

    return (
        <div className="matching-question">

            <h3>{title}</h3>
            <div className={'description-matching-question'}>{description}</div>
            <div className={'example-matching-question'}>
                <h4>Example:</h4>
                {testCases.map((testCase, index) => (
                    <div key={index}>
                        <div>
                            <ol>
                                Input: {testCase.input} <br></br>
                                Result: {testCase.result}
                            </ol>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}