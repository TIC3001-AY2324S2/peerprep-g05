import {
    AppBar,
    Avatar,
    Backdrop,
    Button,
    CircularProgress,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
} from '@mui/material';
import React from 'react';
import { MainSelectors } from '../state/selectors';
import { connect } from 'react-redux';
import { MainActions } from '../state/actions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
class BasePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuAnchorElement: null,
        };
    }


    goToAdminDashboard = () => {
        this.props.navigate('/admin-dashboard');
    }
    logoutUser = () => {
        this.props.setToken(null);
        localStorage.removeItem('token');
        this.props.navigate('/login');
    };


    render() {
        return (
            <>
                {!this.props.isLoginPage && (
                    <AppBar
                        className={'app-bar'}
                        position="static"
                        open
                        variant="dense"
                    >
                        <Toolbar>
                            <img
                                draggable={false}
                                src="/static/peerprep_logo.png"
                                className={'app-bar-logo'}
                                alt=""
                                onClick={() => {
                                    this.props.navigate({
                                        pathname: '/home',
                                        replace: true,
                                    });
                                }}
                            />
                            <div style={{ marginLeft: 'auto' }}>
                                <Tooltip title="Account settings">
                                    <Button
                                        style={{ textTransform: 'none' }}
                                        onClick={(e) => {
                                            this.setState({
                                                menuAnchorElement: e.currentTarget,
                                            })
                                        }}
                                        disableRipple
                                        variant='text'
                                        size="small"
                                    >
                                        <Avatar
                                            sx={{ width: 32, height: 32 }}
                                            src={this.props.userInfo?.profile_picture ?
                                                this.props.userInfo.profile_picture:
                                                `/static/user-avatar-default.png`}
                                        >
                                            M
                                        </Avatar>
                                        <span style={{ marginLeft: '8px', marginRight: '8px', color: '#5541D7' }}>
                                            {this.props.userInfo?.username ? this.props.userInfo.username : 'Username' }
                                        </span>
                                        <ExpandMoreIcon style={{ marginRight: '8px', color: '#5541D7' }} />
                                    </Button>
                                </Tooltip>
                                <Menu
                                    anchorEl={this.state.menuAnchorElement}
                                    id="account-menu"
                                    open={!!this.state.menuAnchorElement}
                                    onClose={() => { this.setState({ menuAnchorElement: null })}}
                                    onClick={() => { this.setState({ menuAnchorElement: null })}}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                        style: {
                                            width: '220px',
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {/*<MenuItem*/}
                                    {/*    onClick={() => {*/}
                                    {/*        this.props.navigate({*/}
                                    {/*            pathname: `/user/${this.props.userInfo.username}/profile/overview`,*/}
                                    {/*            replace: true,*/}
                                    {/*        })*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*    <AccountBoxIcon style={{ marginRight: '8px' }} /> Profile*/}
                                    {/*</MenuItem>*/}
                                    {this.props.userInfo?.isAdmin && (
                                        <MenuItem onClick={this.goToAdminDashboard}>
                                            <SettingsIcon style={{ marginRight: '8px' }} /> Admin Dashboard
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={() => this.logoutUser()}>
                                        <LogoutIcon style={{ marginRight: '8px' }} /> Logout
                                    </MenuItem>

                                </Menu>
                            </div>
                        </Toolbar>
                    </AppBar>
                )}
                <div>
                    <Backdrop
                        sx={{
                            color: '#fff',
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={this.props.isLoading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
                {this.props.component(this.props)}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: MainSelectors.getUserInfo(state),
    isVerifyDone: MainSelectors.getIsVerifyDone(state),
    token: MainSelectors.getToken(state),
    isLoading: MainSelectors.getIsLoading(state),
});

const mapDispatchToProps = {
    setUserInfo: MainActions.setUserInfo,
    setIsVerifyDone: MainActions.setIsVerifyDone,
    setToken: MainActions.setToken,
    setIsLoading: MainActions.setIsLoading,
};
export default connect(mapStateToProps, mapDispatchToProps)(BasePage);
