import {
    Button,
    FormControl,
    TextField,
    Typography,
} from '@mui/material';
import React from 'react';
import { forgotPassword } from '../../apis/app-api';
import './ForgotComponent.scss';
import NavigateButton from '../NavigateButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { showErrorBar, showSuccessBar } from '../../constants/snack-bar';

class ForgotComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            isButtonClicked: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState(
            {
                isButtonClicked: true,
            },
            () => {
                this.props.setIsLoading(true);
                forgotPassword(this.state.email)
                    .then((res) => {
                        if (res.error) {
                            // Display forgot password error
                            this.setState({
                                isButtonClicked: false,
                            });
                            showErrorBar(res.data.message);
                        } else {
                            // Open snackbar to display reset success
                            showSuccessBar('Successfully sent password reset!');
                            this.props.navigate('/login');
                        }
                        this.props.setIsLoading(false);
                        });
            },
        );
    };

    render() {
        if (this.props.token || localStorage.getItem('token')) {
            return <></>;
        }
        return (
            <div className={'forgot-container full-height'}>
                <div
                    className='forgot-left-panel'
                >
                    <NavigateButton
                        url="/login"
                        disableRipple
                        style={{ marginBottom: '40px', display: 'flex', fontWeight: 'bold', justifyContent: 'flex-start', padding: '0px'}}
                        text={
                            <inline className={'forgot-button-back-inline'}>
                                <ArrowBackIosIcon style={{color: '#5541D7', marginRight: '10px'}}/>
                                <Typography className={'forgot-panel-main-title'}>
                                    Peer
                                    <inline style={{ color: '#5541D7' }}>Prep</inline>
                                </Typography>
                            </inline>
                        }
                    />
                    <div className={'forgot-panel-title'}>
                        <div style={{ fontWeight: 'bold', fontSize: '30px', textAlign: 'left' }}>
                            Forgot Password
                        </div>
                        <Typography style={{ color: 'grey', marginTop: '32px' }}>
                            Enter your email to reset your password.
                        </Typography>
                    </div>
                    <form
                        onSubmit={this.handleSubmit}
                        className={'from-forgot-panel'}
                    >
                        <FormControl className={'from-forgot-control'}>
                            <TextField
                                size="medium"
                                className={'forgot-panel-text-field'}
                                onChange={(e) => this.setState({ email: e.target.value }) }
                                value={this.state.email}
                                label={'Email Address'}
                                type={'text'}
                                required
                            />
                            <Button
                                type="submit"
                                size='large'
                                disabled={this.state.isButtonClicked}
                                className={'forgot-panel-main-button'}
                                variant="contained"
                            >
                                Reset Password
                            </Button>
                        </FormControl>
                    </form>
                </div>
                <div
                    className='forgot-right-panel'
                >
                    <img
                        draggable={false}
                        src="/static/peerprep_forgot_deco.png"
                        className={'forgot-deco'}
                        alt=""
                    />
                </div>
            </div>
        );
    }
}

export default ForgotComponent;
