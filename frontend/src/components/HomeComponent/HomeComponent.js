import React, {useState, useEffect} from 'react';
import './HomeComponent.scss';
import {
    cancelMatch,
    getCategoriesByComplexity,
    getMatchHistory,
    startMatch,
    subscribeToTopic
} from '../../apis/matching-service-api';
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
    Pagination
} from '@mui/material';

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
    const [matchSessionHash, setMatchSessionHash] = useState('');
    const [delayedPartner, setDelayedPartner] = useState('');
    const isVerifyDone = props.isVerifyDone;


    useEffect(() => {
        if (isVerifyDone) {
            getCategoriesByComplexity(complexity).then((response) => {
                // console.log("categories", response);
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [complexity, isVerifyDone]);

    useEffect(() => {
        if (isVerifyDone) {
            getMatchHistory(props.userInfo.email, page).then((response) => {
                setMatchHistory(response.data.history);
                setTotalPages(response.data.totalPages);
                if (response.error) {
                    console.error('Failed to fetch history:', response.data);
                    return;
                }
            });
        }
    }, [isVerifyDone, partner, page, props.userInfo?.email]);

    useEffect(() => {
        if (delayedPartner !== '') {
            props.navigate('/collab/' + matchSessionHash);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayedPartner]);

    useEffect(() => {
        if (delayedPartner === '') {
            const timer = setTimeout(() => {
                setDelayedPartner(partner);
            }, 3000);
            return () => setTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partner]);

    useEffect(() => {
        return () => {
            if (client) {
                client.end(true, () => { console.log("MQTT Client disconnected. 1") });
            }
        }
    }, [])

    const complexityHandler = (event, level) => {
        currLevel = level.toUpperCase() + " MODE";
        setComplexity(level);
    };
    const categoryHandler = (event) => {
        setCategory(event.target.value);
    };
    const matchHandler = (event, isMatch, isRetry) => {
        clearInterval(timerId);
        setTimer(15);
        if (isMatch && !isMatching) {
            setIsMatching(true);
            client = subscribeToTopic(props.userInfo.username);
            console.log(props.userInfo);
            client.on('connect', () => {
                startMatch(props.userInfo.username, props.userInfo.email, complexity, category).then((response) => {
                    console.log(new Date().toLocaleString() + ", start match:", response)
                    if (response.error) {
                        console.error('Failed to start match:', response.data);
                        return;
                    }
                });
            })
            const id = setInterval(() => {
                setTimer(counter => {
                    if (counter === 0) {
                        if (client) {
                            client.end(true, () => { console.log("MQTT Client disconnected. 2") });
                        }
                        setIsMatching(false);
                        cancelMatch(props.userInfo.username, props.userInfo.email, complexity, category).then((response) => {
                            console.log(new Date().toLocaleString() + ", cancel match:", response)
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
                console.log(new Date().toLocaleString() + `: Match [${resp.hash}] found for ${props.userInfo.username} and ${resp.partner}`);
                setMatchSessionHash(resp.hash);
                clearInterval(id);
                setPartner(resp.partner);
            });
        } else {
            console.log(client);
            if (client) {
                client.end(true, () => { console.log("MQTT Client disconnected. 3") });
            }
            setPartner('');
            setIsMatching(false);
            if (isRetry) return;
            cancelMatch(props.userInfo.username, props.userInfo.email, complexity, category).then((response) => {
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
                        <InputLabel style={{display: "inline-flex"}}>Category</InputLabel>
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

                <Grid container justifyContent="center" spacing={0} style={{position: "relative", zIndex: 10}}>
                    <div className={'difficulty-tag'}>
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
                            color: "white",
                            marginTop: "10px"
                        }}>
                            {currLevel}
                        </Typography>
                    </div>
                </Grid>
                <Grid container spacing={0} className={'home-session-1'}>
                    <Grid lg={6} className={'matching-people'}>
                        {isMatching ?
                            <div className={'start-matching'}>
                                <div className={'stroke-purple-circle'}>
                                    {partner &&
                                    <Typography variant="h5" align="center" style={{ fontWeight: "bold"}}>
                                                Preparing the<br />collab room with<br />your partner
                                    </Typography>}
                                    {!partner &&
                                    <Typography className={'home-countdown'}>
                                        {timer}
                                    </Typography>}
                                </div>
                                {timer > 0 &&
                                    <div className={'start-matching-inner'}>
                                        <button
                                            className={'home-button-1'}
                                            onClick={(event) => matchHandler(event, false, false)}
                                            disabled={partner}
                                        >
                                            Cancel
                                        </button>
                                        <div className={'start-matching-msg'}>
                                            <CircularProgress size={25} color="inherit"/>
                                            <Stack>
                                                {!partner.length &&
                                                    <p>
                                                        finding a partner for you. . .
                                                    </p>
                                                }
                                                {partner &&
                                                    <p>
                                                        matching you with <span
                                                        style={{color: "#5541D7"}}>{partner}</span>. . .
                                                    </p>
                                                }
                                            </Stack>
                                        </div>
                                    </div>
                                }
                                {timer === 0 &&
                                    <div className={'start-matching-timeout'}>
                                        <button className={'home-button'}
                                                onClick={(event) => matchHandler(event, false, true)}>
                                            Retry
                                        </button>
                                        <p>
                                            There is no match for your search ˙◠˙
                                        </p>
                                    </div>
                                }
                            </div>
                            :
                            <div className={'not-start-match'}>
                                <div className={'stroke-purple-circle'}>
                                    <div className={'purple-circle'}>
                                        <p>Find your partner to start the challenge</p>
                                    </div>
                                </div>
                                <button className={'home-button'} onClick={(event) => matchHandler(event, true, false)}>
                                    Match Now
                                </button>
                                <div className={'place-holder'}></div>
                            </div>
                        }
                    </Grid>
                    <Grid lg={6} className={'history-section'}>
                        <div className={'history-section-inner'}>
                            <Typography variant="h5" align="center" style={{fontWeight: "bold"}}>
                                Matched History
                            </Typography>
                            <div className="section-2">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Partner</th>
                                            <th>Category</th>
                                            <th>Complexity</th>
                                            <th>Date</th>
                                        </tr>
                                        {matchHistory.sort((a, b) => b.id - a.id).map(match => (
                                            <tr key={match.id}>
                                                <td>{match.partner}</td>
                                                <td>{match.category}</td>
                                                <td>{match.complexity}</td>
                                                <td>{moment(match.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
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
                        </div>
                    </Grid>
                </Grid>
            </Container>

        </div>
    );
}

export default HomeComponent;
