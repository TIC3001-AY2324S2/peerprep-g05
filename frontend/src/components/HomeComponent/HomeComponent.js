import React, {useState, useEffect} from 'react';
import './HomeComponent.scss';
import { cancelMatch, getCategoriesByComplexity, getMatchHistory, getQuestionsByCategory, startMatch, subscribeToTopic } from '../../apis/matching-service-api';
import moment from 'moment';
import {
    Container,
    Typography,
    FormControl,
    Stack,
    ListItemButton,
    ListItemText,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Grid,
    Paper,
    Pagination
} from '@mui/material';
import {styled} from '@mui/material/styles';
import CodeEditorComponent from "../CollabComponent/CodeEditorComponent";
import MatchingQuestion from "../CollabComponent/MatchingQuestion";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

let currLevel = "EASY MODE";
let client;

function HomeComponent(props) {
    const [complexity, setComplexity] = useState('Easy');
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState('');
    const [isMatching, setIsMatching] = useState(false);
    const [timerId, setTimerId] = useState(null);
    const [timer, setTimer] = useState(15);
    const [partner, setPartner] = useState('');
    const [matchHistory, setMatchHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const isVerifyDone = props.isVerifyDone;


    useEffect(() => {
        if (isVerifyDone) {
            getCategoriesByComplexity(complexity).then((response) => {
                console.log("categories", response)
                if (response.error) {
                    console.error('Failed to fetch categories:', response.data);
                    return;
                }
                const sortedList = response.data.categories.sort();
                setCategoryList(sortedList);
                if (sortedList.length > 0) {
                    setCategory(sortedList[0]);
                }
            });
            getQuestionsByCategory(complexity, category).then((response) => {
                console.log("questions", response)
                if (response.error) {
                    console.error('Failed to fetch questions:', response.data);
                    return;
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [complexity, isVerifyDone]);

    useEffect(() => {
        if (isVerifyDone) {
            getMatchHistory(props.userInfo.email, page).then((response) => {
                console.log("history", response)
                setMatchHistory(response.data.history);
                setTotalPages(response.data.totalPages);
                if (response.error) {
                    console.error('Failed to fetch history:', response.data);
                    return;
                }
            });
        }
    }, [isVerifyDone, partner, page, props.userInfo?.email]);

    const complexityHandler = (event, level) => {
        currLevel = level.toUpperCase() + " MODE";
        setComplexity(level);
    };
    const categoryHandler = (event) => {
        setCategory(event.target.value);
    };
    const matchHandler = (event, isMatch) => {
        setIsMatching(isMatch);
        clearInterval(timerId);
        setTimer(15);
        if (isMatch) {
            client = subscribeToTopic(props.userInfo.username);
            console.log(props.userInfo);
            client.on('connect', () => {
                startMatch(props.userInfo.username, props.userInfo.email, complexity, category).then((response) => {
                    console.log("start match:", response)
                    if (response.error) {
                        console.error('Failed to start match:', response.data);
                        return;
                    }
                });
            })
            const id = setInterval(() => {
                setTimer(counter => {
                    if (counter === 0) {
                        cancelMatch(props.userInfo.username, complexity, category).then((response) => {
                            console.log("cancel match:", response)
                            if (response.error) {
                                console.error('Failed to cancel match:', response.data);
                                return;
                            }
                        })
                        clearInterval(id);
                        return counter;
                    }
                    return counter - 1;
                });
            }, 1000);
            setTimerId(id);
            client.on('message', (topic, message) => {
                const resp = JSON.parse(message);
                console.log(`Match [${resp.hash}] found for ${props.userInfo.username} and ${resp.partner}`);
                clearInterval(id);
                setPartner(resp.partner);
            });
        } else {
            if (client) {
                client.end();
            }
            setPartner('');
            cancelMatch(props.userInfo.username, complexity, category).then((response) => {
                console.log("cancel match:", response)
                if (response.error) {
                    console.error('Failed to cancel match:', response.data);
                    return;
                }
            })
        }
    };

    return (
        <div className={"home-container"}>
            <Container style={{maxWidth: "85%", padding: "25px 0"}}>
                <Typography variant="h4" align="center" style={{paddingBottom: "5px"}}>
                    Welcome on Board!
                </Typography>
                <Typography variant="h6" align="center">
                    Step into PeerPrep's world, where every challenge is an opportunity.
                </Typography>
                <Stack className={'home-section-1'}>
                    <div className={'home-section-1-difficulty'}>
                        <ListItemButton
                            disabled={isMatching}
                            style={complexity === "Easy" ? {

                                borderColor: "#3CAA91",
                                backgroundColor: "#3CAA91",
                                borderRadius: "5px"
                            } : {border: "solid 1px #3CAA91", borderRadius: "5px"}}
                            onClick={(event) => complexityHandler(event, "Easy")}
                        >
                            <ListItemText primary="Interview Apprentice"
                                          style={complexity === "Easy" ? {color: "#FFFFFF"} : {color: "#3CAA91"}}/>
                        </ListItemButton>
                        <ListItemButton
                            disabled={isMatching}
                            style={complexity === "Medium" ? {
                                padding: "0 10px",
                                borderColor: "#FFA800",
                                backgroundColor: "#FFA800",
                                borderRadius: "5px"
                            } : {border: "solid 1px #FFA800", borderRadius: "5px"}}
                            onClick={(event) => complexityHandler(event, "Medium")}
                        >
                            <ListItemText primary="Coding Maestro"
                                          style={complexity === "Medium" ? {color: "#FFFFFF"} : {color: "#FFA800"}}/>
                        </ListItemButton>
                        <ListItemButton
                            disabled={isMatching}
                            style={complexity === "Hard" ? {
                                borderColor: "#F04461",
                                backgroundColor: "#F04461",
                                borderRadius: "5px"
                            } : {border: "solid 1px #F04461", borderRadius: "5px"}}
                            onClick={(event) => complexityHandler(event, "Hard")}
                        >
                            <ListItemText primary="Algorithm Virtuoso"
                                          style={complexity === "Hard" ? {color: "#FFFFFF"} : {color: "#F04461"}}/>
                        </ListItemButton>
                    </div>
                    <FormControl className={'home-section-1-categories'}>
                        <InputLabel style={{display: "inline-flex"}}>Select a category</InputLabel>
                        <Select
                            disabled={isMatching}
                            style={{textAlign: "left"}}
                            value={category}
                            label="Category"
                            onChange={categoryHandler}
                        >
                            {categoryList.map((category, index) => (
                                <MenuItem key={index} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <Grid container justifyContent="center" spacing={0} style={{position: "relative"}}>
                    {complexity === "Easy" && (
                        <img
                            draggable={false}
                            src="/static/easy_label.png"
                            className={"complexity-label"}
                            alt=""
                        />
                    )}
                    {complexity === "Medium" && (
                        <img
                            draggable={false}
                            src="/static/medium_label.png"
                            className={"complexity-label"}
                            alt=""
                        />
                    )}
                    {complexity === "Hard" && (
                        <img
                            draggable={false}
                            src="/static/hard_label.png"
                            className={"complexity-label"}
                            alt=""
                        />
                    )}
                    <Typography variant="h6" align="center" style={{
                        position: "absolute",
                        top: "10px",
                        left: "13px",
                        fontSize: "17px",
                        color: "white"
                    }}>
                        {currLevel}
                    </Typography>
                    <Grid item lg={6}
                          style={{border: "solid 1px", borderColor: "#5541D7", borderRadius: "5px 0 0 5px"}}>
                        <Item style={{height: "550px"}}>
                            <img
                                draggable={false}
                                src="/static/border_ellipse.png"
                                className={"match-ellipse"}
                                alt=""
                            />
                            {isMatching ?
                                <Container>
                                    <Typography variant="h1" align="center" style={{
                                        marginTop: "165px",
                                        fontWeight: "bold",
                                        color: "#5541D7",
                                        opacity: "50%"
                                    }}>
                                        {timer}
                                    </Typography>
                                    {timer > 0 &&
                                        <Container>
                                            <Stack style={{marginTop: "93px", display: "block"}}>
                                                <CircularProgress color="inherit" size={25} style={{
                                                    display: "inline-block",
                                                    verticalAlign: "text-bottom"
                                                }}/>
                                                {!partner.length &&
                                                    <Typography variant="h6"
                                                                style={{paddingLeft: "15px", display: "inline-block"}}>
                                                        finding a partner for you. . .
                                                    </Typography>
                                                }
                                                {partner &&
                                                    <Typography variant="h6"
                                                                style={{paddingLeft: "15px", display: "inline-block"}}>
                                                        matching you with <span
                                                        style={{color: "#5541D7"}}>{partner}</span>. . .
                                                    </Typography>
                                                }
                                            </Stack>
                                            <ListItemButton
                                                style={{
                                                    marginTop: "15px",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                    width: "120px",
                                                    textAlign: "center",
                                                    border: "solid 1px",
                                                    borderColor: "#5541D7",
                                                    borderRadius: "5px"
                                                }}
                                                onClick={(event) => matchHandler(event, false)}
                                            >
                                                <ListItemText primary="Cancel" style={{color: "#5541D7"}}/>
                                            </ListItemButton>
                                        </Container>
                                    }
                                    {timer === 0 &&
                                        <Container>
                                            <Typography variant="h6" style={{
                                                marginTop: "90px",
                                                marginLeft: "auto",
                                                marginRight: "auto"
                                            }}>
                                                There is no match for your search.
                                            </Typography>
                                            <ListItemButton
                                                style={{
                                                    marginTop: "18px",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                    width: "120px",
                                                    textAlign: "center",
                                                    border: "solid 1px",
                                                    borderColor: "#5541D7",
                                                    backgroundColor: "#5541D7",
                                                    borderRadius: "5px"
                                                }}
                                                onClick={(event) => matchHandler(event, false)}
                                            >
                                                <ListItemText primary="Retry" style={{color: "#FFFFFF"}}/>
                                            </ListItemButton>
                                        </Container>
                                    }
                                </Container>
                                :
                                <Container>
                                    <img
                                        draggable={false}
                                        src="/static/ellipse.png"
                                        className={"match-ellipse"}
                                        alt=""
                                    />
                                    <Typography variant="h5" align="center"
                                                style={{marginTop: "170px", fontWeight: "bold"}}>
                                        Find your<br/>partner to start<br/>the challenge
                                    </Typography>
                                    <ListItemButton
                                        style={{
                                            marginTop: "151px",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            width: "150px",
                                            textAlign: "center",
                                            border: "solid 1px",
                                            borderColor: "#5541D7",
                                            backgroundColor: "#5541D7",
                                            borderRadius: "5px"
                                        }}
                                        onClick={(event) => matchHandler(event, true)}
                                    >
                                        <ListItemText primary="Match Now" style={{color: "#FFFFFF"}}/>
                                    </ListItemButton>

                                </Container>
                            }
                        </Item>
                    </Grid>

                    <Grid item lg={6}
                          style={{border: "solid 1px", borderColor: "#a3a3a3", borderRadius: "0 5px 5px 0"}}>
                        <Item style={{height: "550px"}}>
                            <Container style={{margin: "30px 0"}}>
                                <Typography variant="h5" align="center" style={{fontWeight: "bold"}}>
                                    Session History
                                </Typography>
                                <div className="section-2">
                                    <table>
                                        <tr>
                                            <th>ID</th>
                                            <th>Partner</th>
                                            <th>Category</th>
                                            <th>Complexity</th>
                                            <th>Date</th>
                                        </tr>
                                        {matchHistory.map(match => (
                                            <tr>
                                                <td>#{match.id}</td>
                                                <td>{match.partner}</td>
                                                <td>{match.category}</td>
                                                <td>{match.complexity}</td>
                                                <td>{moment(match.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                                            </tr>
                                        ))}
                                    </table>
                                    <div className={'pagination'}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={(event, value) => setPage(value)}
                                            color="secondary"
                                            className="pagination-active"
                                        />
                                    </div>
                                </div>
                            </Container>
                        </Item>
                    </Grid>

                </Grid>
                <Grid container spacing={0} className={'collaboration-session'}>
                    <Grid xs={6} className={'collaboration-question'}>
                        <div className={'collaboration-inner'}>
                            <MatchingQuestion
                                {...props}
                            />
                        </div>
                    </Grid>
                    <Grid xs={6} className={'collaboration-code-editor'}>
                        <div className={'collaboration-inner'}>
                            <CodeEditorComponent/>
                        </div>
                    </Grid>
                </Grid>

            </Container>

        </div>
    );
}

export default HomeComponent;
