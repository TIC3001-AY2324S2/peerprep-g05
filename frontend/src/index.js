import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import store from './state/store';
import { StyledMaterialDesignContent } from './constants/snack-bar';
import Modal from 'react-modal';

Modal.setAppElement('#root');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        Components={{
            success: StyledMaterialDesignContent,
            error: StyledMaterialDesignContent,
        }}
    >
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </SnackbarProvider>,

);
