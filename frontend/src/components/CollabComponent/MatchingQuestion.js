import {useState, useEffect, useCallback} from "react";
import {getQuestionById} from "../../apis/crud-question";
import './CollabComponent.scss';
import {getSessionInfoByHash} from "../../apis/collaboration-service";

export default function MatchingQuestion(props) {

    // const qId = pathId || props.id;
    const [qId, setQid] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [testCases, setTestCases] = useState([{input: '', result: ''}]);
    const {isVerifyDone} = props;
    useEffect(() => {
        if (props.matchSessionHash && props.matchSessionHash !== '') {
            setTimeout(() => {
                getSessionInfoByHash(props.matchSessionHash)
                    .then(resp => {
                        if (!resp.error) {
                            console.log("get session info by hash", resp)
                            setQid(resp.data.question.questionid);
                        }
                    });
            }, 100);
        }
    }, [props.matchSessionHash]);

    const refreshQuestions = useCallback(() => {
        if (!isVerifyDone) {
            return;
        }
        if (!qId) {
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
    }, [isVerifyDone, qId]);

    useEffect(() => {
        refreshQuestions();
    }, [refreshQuestions, qId]);

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