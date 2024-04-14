import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import {Provider} from 'react-redux';
import store from './state/store';
import {StyledMaterialDesignContent} from './constants/snack-bar';
import Modal from 'react-modal';

Modal.setAppElement('#root');
// Save a reference to the original ResizeObserver
const OriginalResizeObserver = window.ResizeObserver;

// Create a new ResizeObserver constructor
window.ResizeObserver = function (callback) {
    const wrappedCallback = (entries, observer) => {
        window.requestAnimationFrame(() => {
            callback(entries, observer);
        });
    };

    // Create an instance of the original ResizeObserver
    // with the wrapped callback
    return new OriginalResizeObserver(wrappedCallback);
};

// Copy over static methods, if any
for (let staticMethod in OriginalResizeObserver) {
    if (OriginalResizeObserver.hasOwnProperty(staticMethod)) {
        window.ResizeObserver[staticMethod] = OriginalResizeObserver[staticMethod];
    }
}
;
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
                <App/>
            </BrowserRouter>
        </Provider>
    </SnackbarProvider>,
);
