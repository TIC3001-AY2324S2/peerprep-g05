import {
    Alert,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import React from 'react';
import { loginAccount, registerAccount } from '../../apis/app-api';
import './LoginComponent.scss';
import NavigateButton from '../NavigateButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    initialLoginPageState,
} from '../../constants/constants';
import axios from 'axios';
import { showSuccessBar } from '../../constants/snack-bar';

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...initialLoginPageState,
            isRegisterPage: this.props.isRegisterPage,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isRegisterPage !== nextProps.isRegisterPage) {
            return {
                ...initialLoginPageState,
                isRegisterPage: nextProps.isRegisterPage,
            };
        }
        // Return null to indicate no change to state.
        return null;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState(
            {
                errorMessage: '',
                isButtonClicked: true,
            },
            () => {
                this.props.setIsLoading(true);
                if (this.props.isRegisterPage) {
                    registerAccount({
                        username: this.state.username,
                        password: this.state.password,
                        email: this.state.email,
                    }).then((res) => {
                        if (res.error) {
                            // Display register error
                            this.setState({
                                errorMessage: res.data.message,
                                isButtonClicked: false,
                            });
                        } else {
                            // Open snackbar to display register success
                            showSuccessBar(`Successfully registered an account for [${this.state.username}]!`);
                            this.props.navigate('/login');
                        }
                        this.props.setIsLoading(false);
                    });
                } else {
                    loginAccount({
                        email: this.state.email,
                        password: this.state.password,
                    }).then((res) => {
                        if (res.error) {
                            // Display login error
                            this.setState({
                                errorMessage: res.data.message,
                                isButtonClicked: false,
                            });
                        } else {
                            localStorage.setItem('token', res.data.token);
                            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                            this.props.setToken(res.data.token);
                            this.props.setIsVerifyDone(true);
                            this.props.navigate('/home');
                            this.props.setUserInfo(res.data.userInfo);
                            // Open snackbar to display login success
                            showSuccessBar(`Successfully logged in to [${res.data.userInfo.username}]!`);
                        }
                        this.props.setIsLoading(false);
                    });
                }
            },
        );
    };

    updateState = (target, value) => {
        this.setState({
            [target]: value,
        });
    };

    inverseState = (target) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                [target]: !prevState[target],
            };
        });
    };

    renderShowPasswordIcon = (target) => {
        return (
            <InputAdornment position="end">
                <IconButton
                    disableRipple
                    aria-label="toggle password visibility"
                    onClick={() => this.inverseState(target)}
                    onMouseDown={(e) => e.preventDefault}
                    edge="end"
                >
                    {this.state[target] ? (
                        <VisibilityOffIcon />
                    ) : (
                        <VisibilityIcon />
                    )}
                </IconButton>
            </InputAdornment>
        );
    };

    renderTextField = (
        isStandard,
        target,
        value,
        label,
        showPassword,
        showPassTarget,
    ) => {
        return (
            <TextField
                size="medium"
                className={
                    isStandard
                        ? 'standard-panel-text-field'
                        : 'helper-text-field'
                }
                onChange={(e) => this.updateState(target, e.target.value)}
                value={value}
                label={label}
                type={showPassTarget && !showPassword ? 'password' : 'text'}
                InputProps={{
                    endAdornment: showPassTarget
                        ? this.renderShowPasswordIcon(showPassTarget)
                        : '',
                }}
                helperText={
                    target === 'email' ? "We'll never share your email." : ''
                }
                required
            />
        );
    };

    renderLoginForm = () => {
        return (
            <>
                {this.renderTextField(
                    true,
                    'email',
                    this.state.email,
                    'Email Address',
                )}
                {this.renderTextField(
                    true,
                    'password',
                    this.state.password,
                    'Password',
                    this.state.showPassword,
                    'showPassword',
                )}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'end',
                        flexDirection: 'column',
                        margin: '0px 32px 0px 32px',
                    }}
                >
                    <NavigateButton
                        url="/forgot"
                        disableRipple
                        style={{
                            backgroundColor: 'transparent',
                            color: 'grey',
                            fontWeight: 'bold',
                        }}
                        text="Forgot password?"
                    />
                    <div
                        style={{
                            marginTop: '32px',
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                        }}
                    >
                        <inline style={{ color: 'grey', display: 'flex', alignItems: 'center' }}>
                            <inline>
                                Don't have an account?
                            </inline>
                            <NavigateButton
                                url="/register"
                                disableRipple
                                style={{
                                    backgroundColor: 'transparent',
                                }}
                                text={
                                <inline style={{ marginLeft: '4px', color: '#5541D7', fontWeight: 'bold' }}>
                                    Sign up now
                                </inline>
                                }
                            />
                        </inline>
                        <Button
                            type="submit"
                            size='large'
                            disabled={this.state.isButtonClicked}
                            className={'login-panel-main-button'}
                            variant="contained"
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </>
        );
    };

    renderRegisterForm = () => {
        // helperText="Only alphanumerics, maximum 30 characters. "
        // TODO add username regex validation
        // helperText="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters."
        // TODO add password regex validation
        return (
            <>
                {this.renderTextField(
                    true,
                    'username',
                    this.state.username,
                    'Display Name',
                )}
                {this.renderTextField(
                    false,
                    'email',
                    this.state.email,
                    'Email',
                )}
                {this.renderTextField(
                    true,
                    'password',
                    this.state.password,
                    'Password',
                    this.state.showPassword,
                    'showPassword',
                )}
                {this.renderTextField(
                    true,
                    'confirmPassword',
                    this.state.confirmPassword,
                    'Retype password',
                    this.state.showConfirmPassword,
                    'showConfirmPassword',
                )}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '0px 32px 0px 32px',
                    }}
                >
                    <div
                        style={{
                            marginTop: '32px',
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                        }}
                    >
                        <inline style={{ color: 'grey', display: 'flex', alignItems: 'center' }}>
                            <inline>
                                Already have an account?
                            </inline>
                            <NavigateButton
                                url="/login"
                                disableRipple
                                style={{
                                    backgroundColor: 'transparent',
                                }}
                                text={
                                <inline style={{ marginLeft: '4px', color: '#5541D7', fontWeight: 'bold' }}>
                                    Login now
                                </inline>
                                }
                            />
                        </inline>
                        <Button
                            type="submit"
                            size='large'
                            disabled={this.state.isButtonClicked}
                            className={'login-panel-main-button'}
                            variant="contained"
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
            </>
        );
    };

    render() {
        if (this.props.token || localStorage.getItem('token')) {
            return <></>;
        }
        return (
            <div className={'login-container full-height'}>
                <div
                    className='main-left-panel'
                >
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <img
                            draggable={false}
                            src="/static/peerprep_logo.png"
                            className={'main-logo'}
                            alt=""
                        />
                        <inline style={{ fontWeight: 'bold', marginTop: '16px', fontSize: '31px' }}>
                            Elevate Interviews Together!
                        </inline>
                    </div>
                    <img
                        draggable={false}
                        src="/static/peerprep_deco.png"
                        className={'main-deco'}
                        alt=""
                    />
                </div>
                <div
                    className='main-right-panel'
                >
                    <div
                        className='sub-right-panel'
                    >
                        <Typography className={'login-panel-main-title'}>
                            {this.props.isRegisterPage
                                ? 'Sign up with Peer'
                                : 'Login to Peer'}
                                <inline style={{ color: '#5541D7' }}>Prep</inline>
                        </Typography>
                        {this.state.errorMessage !== '' && (
                            <Alert className="main-panel-error" severity="error">
                                {this.state.errorMessage}
                            </Alert>
                        )}
                        <form
                            onSubmit={this.handleSubmit}
                            className={'from-login-panel'}
                        >
                            <FormControl className={'form-login-control'}>
                                {this.props.isRegisterPage
                                    ? this.renderRegisterForm()
                                    : this.renderLoginForm()}
                            </FormControl>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginComponent;
