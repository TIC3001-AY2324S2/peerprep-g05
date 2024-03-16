import React, { useState } from 'react';
import './HomeComponent.scss';
import { Container, Typography, FormControl, Stack, ListItemButton, ListItemText, InputLabel, Select, MenuItem, CircularProgress, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

let currLevel = "EASY MODE";

function HomeComponent() {
    const [complexity, setComplexity] = useState('easy');
    const [category, setCategory] = useState('');
    const [match, setMatch] = useState(false);
    const [timer, setTimer] = useState(0);

    const complexityHandler = (event, level) => {
        currLevel = level.toUpperCase() + " MODE";
        setComplexity(level);
    };
    const categoryHandler = (event) => {
        setCategory(event.target.value);
    };
    const matchHandler = (event, isMatch) => {
        setTimer(15)
        setMatch(isMatch);
    };

    return (
        <div className={"home-container"}>
            <Container maxWidth="lg" style={{padding: "25px 0"}}>
                <Typography variant="h4" align="center" style={{paddingBottom: "5px"}}>
                    Welcome on Board!
                </Typography>
                <Typography variant="h6" align="center">
                    Step into PeerPrep's world, where every challenge is an opportunity.
                </Typography>
                <Stack direction="row" spacing={3} style={{padding: "35px 0 25px 0"}}>
                    <ListItemButton
                        disabled={match}
                        style={complexity === "easy" ? {border: "solid 1px", borderColor: "#3CAA91", backgroundColor: "#3CAA91", borderRadius: "5px"} : {border: "solid 1px", borderColor: "#3CAA91", borderRadius: "5px"}}
                        onClick={(event) => complexityHandler(event, "easy")}
                    >
                        <ListItemText primary="Interview Apprentice" style={complexity === "easy" ? {color: "#FFFFFF"} : {color: "#3CAA91"}}/>
                    </ListItemButton>
                    <ListItemButton
                        disabled={match}
                        style={complexity === "medium" ? {border: "solid 1px", borderColor: "#FFA800", backgroundColor: "#FFA800", borderRadius: "5px"} : {border: "solid 1px", borderColor: "#FFA800", borderRadius: "5px"}}
                        onClick={(event) => complexityHandler(event, "medium")}
                    >
                        <ListItemText primary="Coding Maestro" style={complexity === "medium" ? {color: "#FFFFFF"} : {color: "#FFA800"}}/>
                    </ListItemButton>
                    <ListItemButton
                        disabled={match}
                        style={complexity === "hard" ? {border: "solid 1px", borderColor: "#F04461", backgroundColor: "#F04461", borderRadius: "5px"} : {border: "solid 1px", borderColor: "#F04461", borderRadius: "5px"}}
                        onClick={(event) => complexityHandler(event, "hard")}
                    >
                        <ListItemText primary="Algorithm Virtuoso" style={complexity === "hard" ? {color: "#FFFFFF"} : {color: "#F04461"}}/>
                    </ListItemButton>
                    <FormControl style={{marginLeft: "150px", width: "450px", textAlign: "left"}}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            disabled={match}
                            value={category}
                            label="Category"
                            onChange={categoryHandler}
                        >
                            <MenuItem value={0}>Category 1</MenuItem>
                            <MenuItem value={1}>Category 2</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Grid container justifyContent="center" spacing={0} style={{position: "relative"}}>
                    {complexity === "easy" && (
                        <img
                            draggable={false}
                            src="/static/easy_label.png"
                            className={"complexity-label"}
                            alt=""
                        />
                    )}
                    {complexity === "medium" && (
                        <img
                            draggable={false}
                            src="/static/medium_label.png"
                            className={"complexity-label"}
                            alt=""
                        />
                    )}
                    {complexity === "hard" && (
                        <img
                            draggable={false}
                            src="/static/hard_label.png"
                            className={"complexity-label"}
                            alt=""
                        />
                    )}
                    <Typography variant="h6" align="center" style={{position: "absolute", top: "10px", left: "13px", fontSize: "17px", color: "white"}}>
                        {currLevel}
                    </Typography>
                    <Grid item lg={6} style={{border: "solid 1px", borderColor: "#5541D7", borderRadius: "5px 0 0 5px"}}>
                        <Item style={{height: "550px"}}>
                            <img
                                style={{marginTop: "100px", left: "180px"}}
                                draggable={false}
                                src="/static/border_ellipse.png"
                                className={"match-ellipse"}
                                alt=""
                            />
                            {match ?
                                <Container style={{width: "560px"}}>
                                    <Typography variant="h1" align="center" style={{marginTop: "170px", fontWeight: "bold", color: "#5541D7", opacity: "50%"}}>
                                        {timer}
                                    </Typography>
                                    {timer === 0 ?
                                        <Container>
                                            <Typography variant="h6" style={{marginTop: "90px", marginLeft: "20px"}}>
                                                There is no match for your search.
                                            </Typography>
                                            <ListItemButton
                                                style={{marginTop: "18px", marginLeft: "176px", width: "120px", textAlign: "center", border: "solid 1px", borderColor: "#5541D7", backgroundColor: "#5541D7", borderRadius: "5px"}}
                                                onClick={(event) => matchHandler(event, false)}
                                            >
                                                <ListItemText primary="Retry" style={{color: "#FFFFFF"}}/>
                                            </ListItemButton>
                                        </Container>
                                    :
                                        <Container>
                                            <Stack style={{marginTop: "90px", marginLeft: "100px"}}>
                                                <CircularProgress color="inherit" size={25}/>
                                                <Typography variant="h6" style={{position: "absolute", marginLeft: "35px"}}>
                                                    finding a partner for you. . .
                                                </Typography>
                                            </Stack>
                                            <ListItemButton
                                                style={{marginTop: "25px", marginLeft: "176px", width: "120px", textAlign: "center", border: "solid 1px", borderColor: "#5541D7", borderRadius: "5px"}}
                                                onClick={(event) => matchHandler(event, false)}
                                            >
                                                <ListItemText primary="Cancel" style={{color: "#5541D7"}}/>
                                            </ListItemButton>
                                        </Container>
                                    }
                                </Container>
                            :
                                <Container style={{width: "560px"}}>
                                    <img
                                        style={{top: "127px", left: "198px"}}
                                        draggable={false}
                                        src="/static/ellipse.png"
                                        className={"match-ellipse"}
                                        alt=""
                                    />
                                    <Typography variant="h5" align="center" style={{marginTop: "175px", marginLeft: "10px", fontWeight: "bold"}}>
                                        Find your<br />partner to start<br />the challenge
                                    </Typography>
                                    <ListItemButton
                                        style={{marginTop: "151px", marginLeft: "200px", width: "120px", textAlign: "center", border: "solid 1px", borderColor: "#5541D7", backgroundColor: "#5541D7", borderRadius: "5px"}}
                                        onClick={(event) => matchHandler(event, true)}
                                    >
                                        <ListItemText primary="Match Now" style={{color: "#FFFFFF"}}/>
                                    </ListItemButton>
                                </Container>
                            }
                        </Item>
                    </Grid>
                    <Grid item lg={6} style={{border: "solid 1px", borderColor: "#a3a3a3", borderRadius: "0 5px 5px 0"}}>
                        <Item style={{height: "550px"}}></Item>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default HomeComponent;
