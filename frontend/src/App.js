import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import './App.scss';
import ErrorPage from './pages/error-page';
import ForgotPage from './pages/forgot-page';
import LoginPage from './pages/login-page';
import HomePage from './pages/home-page';
import { MainSelectors } from './state/selectors';
import { MainActions } from './state/actions';
import axios from 'axios';
import { verifyToken } from './apis/app-api';
import { showErrorBar } from './constants/snack-bar';
import EditQuestion from "./components/EditQuestion/EditQuestion";
import AdminPage from "./pages/admin-dashboard";

const App = (props) => {
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        const isLoginPage =
            window.location.pathname === '/login' ||
            window.location.pathname === 'register' ||
            window.location.pathname === '/forgot';
        let token = props.token;
        if (token) {
            if (isLoginPage) {
                navigate('/home');
            }
        } else {
            token = localStorage.getItem('token');
            if (!props.isLoading && token) {
                props.setIsLoading(true);
                verifyToken(`Bearer ${token}`).then((res) => {
                    if (!res.error) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        props.setToken(token);
                        if (isLoginPage) {
                            navigate('/home');
                        }
                    } else {
                        axios.defaults.headers.common['Authorization'] = '';
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                    props.setUserInfo(res.data.userInfo);
                    props.setIsLoading(false);
                    props.setIsVerifyDone(true);
                });
            }
            if (token) {
                axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${token}`;
            } else if (!isLoginPage) {
                showErrorBar('Please log in to continue.')
                axios.defaults.headers.common['Authorization'] = '';
                navigate('/login');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const mainProps = {
        location: location,
        navigate: navigate,
    };
    return (
        <Routes>
            <Route path="" exact element={<Navigate replace to="/login" />} />
            <Route
                path="/login"
                exact
                element={
                    <LoginPage {...mainProps} />
                }
            />
            <Route
                path="/register"
                exact
                element={<LoginPage {...mainProps} isRegisterPage />}
            />
            <Route
                path="/forgot"
                exact
                element={<ForgotPage {...mainProps} />}
            />
            <Route
                path="/home"
                exact
                element={<HomePage {...mainProps} />}
            />
            <Route
                path="/admin-dashboard"
                exact
                element={<AdminPage {...mainProps} />}
            />
            <Route
                path="/questions/edit/:id"
                exact
                element={<EditQuestion {...mainProps} />}
            />
            <Route path="*" element={<ErrorPage {...mainProps} />} />
        </Routes>
    );
};

const mapStateToProps = (state) => ({
    token: MainSelectors.getToken(state),
    isLoading: MainSelectors.getIsLoading(state),
});

const mapDispatchToProps = {
    setUserInfo: MainActions.setUserInfo,
    setIsVerifyDone: MainActions.setIsVerifyDone,
    setToken: MainActions.setToken,
    setIsLoading: MainActions.setIsLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
