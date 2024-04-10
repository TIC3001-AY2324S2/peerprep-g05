import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useNavigate, useLocation, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import App from './App';
import { showErrorBar } from './constants/snack-bar';

const mockStore = configureMockStore();

// Mock the verifyToken API call
jest.mock('./apis/user-service-api', () => ({
    verifyToken: jest.fn().mockResolvedValue({ error: false }),
  }));

jest.mock('react-router-dom', () => ({
...jest.requireActual('react-router-dom'),
useNavigate: jest.fn(),
useLocation: jest.fn(),
}));

jest.mock('./constants/snack-bar', () => ({
    showErrorBar: jest.fn(),
}));
  
describe('App', () => {
    it('navigates to home if token exists and is on login page', async () => {
        const store = mockStore({
            main: {
            isLoading: true,
            token: 'Bearer validToken',
            userInfo: null,
            }
        });

        useNavigate.mockReturnValue(jest.fn());
        useLocation.mockReturnValue({ pathname: '/login' });

        localStorage.setItem('token', 'validToken');

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <App
                        isLoading={false}
                        setIsLoading={jest.fn()}
                        setToken={jest.fn()}
                        setIsVerifyDone={jest.fn()}
                        setUserInfo={jest.fn()}
                    />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(useNavigate()).toHaveBeenCalledWith('/home');
        });
    });

    it('navigates to login if token does not exist or is invalid', async () => {
        const store = mockStore({
            main: {
            isLoading: true,
            token: null,
            userInfo: null,
            }
        });

        useNavigate.mockReturnValue(jest.fn());
        useLocation.mockReturnValue({ pathname: '/login' });

        // Set window.location.pathname to '/home'
        delete window.location;
        window.location = new URL('http://localhost/home');

        localStorage.removeItem('token');

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <App
                        isLoading={false}
                        setIsLoading={jest.fn()}
                        setToken={jest.fn()}
                        setIsVerifyDone={jest.fn()}
                        setUserInfo={jest.fn()}
                    />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(useNavigate()).toHaveBeenCalledWith('/login');
            expect(showErrorBar).toHaveBeenCalledWith('Please log in to continue.');
        });
    });
});