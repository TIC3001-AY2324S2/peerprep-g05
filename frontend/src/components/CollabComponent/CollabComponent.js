import React, {useState, useEffect} from 'react';
import {
    getMatchForUser,
} from '../../apis/matching-service-api';
import {
    Container,
    Typography,
    FormControl,
    Stack,
    ListItemButton,
    ListItemText,
    InputLabel,
    Select,
    Grid,
    MenuItem,
} from '@mui/material'; 
import CodeEditorComponent from "../CollabComponent/CodeEditorComponent";
import MatchingQuestion from "../CollabComponent/MatchingQuestion";
import { useParams } from "react-router-dom";

function CollabComponent(props) {
    const [complexity, setComplexity] = useState('');
    const [category, setCategory] = useState('');
    const [partner, setPartner] = useState('');
    const { matchSessionHash } = useParams();
    const { isVerifyDone } = props;

    useEffect(() => {
        if (isVerifyDone && partner === '') {
            getMatchForUser(props.userInfo.email, matchSessionHash).then((res) => {
                if (res.error) {
                    props.navigate('/home');
                }
                setComplexity(res.data.matchDetails.complexity);
                setCategory(res.data.matchDetails.category);
                setPartner(res.data.matchDetails.partner);
            });
        }
        // eslint-disable-next-line
    }, [matchSessionHash, isVerifyDone]);

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
                            disabled
                            style={complexity === "Easy" ? {
                                borderColor: "#3CAA91",
                                backgroundColor: "#3CAA91",
                                borderRadius: "5px"
                            } : {border: "solid 1px #3CAA91", borderRadius: "5px"}}
                        >
                            <ListItemText primary="Interview Apprentice"
                                          style={complexity === "Easy" ? {color: "#FFFFFF"} : {color: "#3CAA91"}}/>
                        </ListItemButton>
                        <ListItemButton
                            disabled
                            style={complexity === "Medium" ? {
                                padding: "0 10px",
                                borderColor: "#FFA800",
                                backgroundColor: "#FFA800",
                                borderRadius: "5px"
                            } : {border: "solid 1px #FFA800", borderRadius: "5px"}}
                        >
                            <ListItemText primary="Coding Maestro"
                                          style={complexity === "Medium" ? {color: "#FFFFFF"} : {color: "#FFA800"}}/>
                        </ListItemButton>
                        <ListItemButton
                            disabled
                            style={complexity === "Hard" ? {
                                borderColor: "#F04461",
                                backgroundColor: "#F04461",
                                borderRadius: "5px"
                            } : {border: "solid 1px #F04461", borderRadius: "5px"}}
                        >
                            <ListItemText primary="Algorithm Virtuoso"
                                          style={complexity === "Hard" ? {color: "#FFFFFF"} : {color: "#F04461"}}/>
                        </ListItemButton>
                    </div>
                    <FormControl className={'home-section-1-categories'}>
                        <InputLabel style={{display: "inline-flex"}}>Category</InputLabel>
                        <Select
                            disabled
                            style={{textAlign: "left"}}
                            value={category}
                            label="Category"
                        >
                            <MenuItem key={`${category}_1`} value={category}>{category}</MenuItem>
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
                            {complexity ? `${complexity} MODE` : ''}
                        </Typography>
                    </div>
                </Grid>
                <Grid container spacing={0} className={'collaboration-session'}>
                    <Grid sm={12} md={6} className={'collaboration-question'}>
                        <div className={'collaboration-inner'}>
                            <MatchingQuestion
                                matchSessionHash={matchSessionHash}
                                {...props}
                            />
                        </div>
                    </Grid>
                    <Grid sm={12} md={6} className={'collaboration-code-editor'}>
                        <div className={'collaboration-inner'}>
                            <CodeEditorComponent
                                matchSessionHash={matchSessionHash}
                                {...props}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default CollabComponent;