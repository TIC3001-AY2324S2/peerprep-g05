import './EditQuestion.scss'
import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {createOrUpdateQuestion, getQuestionById} from "../../apis/crud-question";
import Select from 'react-select';

export default function EditQuestion(props) {

    const categoryList = [
        {value: 'Strings', label: 'Strings'},
        {value: 'Algorithms', label: 'Algorithms'},
        {value: 'Brainteaser', label: 'Brainteaser'},
        {value: 'Data Structure', label: 'Data Structure'},
        {value: 'Databases', label: 'Databases'},
        {value: 'Recursion', label: 'Recursion'},
        {value: 'Bit Manipulation', label: 'Bit Manipulation'},
    ];
    const getCategoryByValue = (values) => {
        return categoryList.filter(categories => values.includes(categories.value));
    }
    const difficulties = [
        {value: 'Easy', label: 'Easy'},
        {value: 'Medium', label: 'Medium'},
        {value: 'Hard', label: 'Hard'},
    ];
    const getDifficultyByValue = (value) => {
        return difficulties.find(difficulty => difficulty.value === value);
    }

    const {id: pathId} = useParams();

    const qId = pathId || props.id;

    const [id, setId] = useState(qId);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [testCases, setTestCases] = useState([{input: '', result: ''}]);
    const [categories, setCategory] = useState([]);
    const [difficulty, setDifficulty] = useState('');

    const handleAddTestCase = () => {
        setTestCases([...testCases, {input: '', result: ''}]);
    };
    const handleRemoveTestCase = (index) => {
        const newTestCases = [...testCases];
        newTestCases.splice(index, 1);
        setTestCases(newTestCases);
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const handleCategoryChange = (selectedOptions) => {
        setCategory(selectedOptions.map(option => option.value));
    };

    const handleDifficultyChange = (selectedOption) => {
        setDifficulty(selectedOption.value);
    };


    useEffect(() => {
        if (qId !== null) {
            getQuestionById(qId)
                .then(resp => {
                    if (resp.error) {
                        console.error('Failed to fetch question:', data.data);
                        return;
                    }
                    console.log("get question by id", resp.data)
                    let data = resp.data.question;
                    setId(data.id);
                    setTitle(data.title);
                    setDescription(data.description);
                    setTestCases(data.testCase || []);
                    setCategory(data.categories || []);
                    setDifficulty(data.complexity || 'Easy');
                });
        } else {
            setId(null);
            setTitle('');
            setDescription('');
            setTestCases([{input: '', result: ''}]);
            setCategory([]);
            setDifficulty('easy');
        }
    }, [qId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitting', id, title, description, testCases, categories, difficulty);
        if (!title || !description || !testCases.length || !categories.length || !difficulty) {
            alert('All fields are required');
            return;
        }

        // Serialize state to JSON
        const questionData = {
            id,
            title,
            description,
            testCase: testCases,
            categories,
            complexity: difficulty
        };
        createOrUpdateQuestion(questionData)
            .then(resp => {
                if (resp.error) {
                    console.error('Failed to create or update question:', resp.data);
                    return;
                }
                alert('Question created or updated successfully');
                props.closeModal();
                props.refreshQuestions();
            })
    };

    const navigate = useNavigate();

    const handleCancel = () => {
        props.closeModal();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className={'from-header'}>{id !== null ? 'Edit Question' : 'Add New Question'}</h2>
            <label>Question Title * </label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <label>Question Description * </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>

            {/* handle test cases, category and difficulty inputs similarly */}
            {testCases.map((testCase, index) => (

                <div key={index} className={'form-section-testcase-1'}>
                    <div className={'form-section-1'}>
                        <div className={'test-case'}>
                            <label>Test Case</label>
                            <textarea value={testCase.input}
                                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}/>
                        </div>
                        <div className={'test-result'}>
                            <label>Test Result</label>
                            <textarea value={testCase.result}
                                      onChange={(e) => handleTestCaseChange(index, 'result', e.target.value)}/>
                        </div>
                    </div>

                    <button className={'remove-testcase'} type={'button'}
                            onClick={() => handleRemoveTestCase(index)}>Remove
                    </button>

                </div>
            ))}

            <div className={'form-section-testcase-2'}>
                <button className={'add-testcase'} type={'button'} onClick={handleAddTestCase}>Add Test Case
                </button>
            </div>
            <div className={'form-section-2'}>

                <div className={'form-category'}>
                    <label>Categories * </label>
                    <Select
                        isMulti
                        name="categories"
                        options={categoryList}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleCategoryChange}
                        value={getCategoryByValue(categories)}
                    />
                </div>
                <div className={'form-difficulty'}>
                    <label>Difficulty * </label>
                    <Select
                        name="difficulty"
                        options={difficulties}
                        className="basic-single-select"
                        classNamePrefix="select"
                        onChange={handleDifficultyChange}
                        value={getDifficultyByValue(difficulty)}
                    />
                </div>
            </div>
            <div className={'form-buttons'}>
                <button type="button" onClick={handleCancel}>Cancel</button>
                <button className={'submit-btn'} type="submit">Save</button>
            </div>
        </form>

    );
}