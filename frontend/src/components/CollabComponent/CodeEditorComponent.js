import './CollabComponent.scss'
import {useRef, useEffect, useState} from 'react';
import Editor from "@monaco-editor/react";
import {showErrorBar, showSuccessBar} from "../../constants/snack-bar";
import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_DOCKER_COLLABORATION_SVC_SOCKET_URL || 'http://localhost:3009';

const getSocket = () => {
    return io(URL);
};

const statusMsg = {
    'red': 'Offline',
    'orange': 'Partner Offline',
    'green': 'Online'
}

export default function CodeEditorComponent(props) {
    let socket = getSocket();
    const editorRef = useRef(null);
    const isConnected = useRef(false)
    let isSocket = false;
    const [statusColor, setStatusColor] = useState('red');
    const [initialValue, setInitialValue] = useState('');

    // Reference: https://github.com/tbvjaos510/monaco-editor-socket-io/blob/master/server/public/js/monaco.js#L84

    const sessionId = props.matchSessionHash;
    const ssRef = useRef(sessionId);
    useEffect(() => {
        if (sessionId && sessionId !== '') {
            socket.emit("joinSession", sessionId, props.userInfo.username);
            isConnected.current = true
            ssRef.current = sessionId;
        }
        // eslint-disable-next-line
    }, [sessionId]);

    useEffect(() => {
        return () => {
          socket.disconnect();
        };
        // eslint-disable-next-line
      }, []);

    socket.on('disconnect1', (disconnectedMsg, socketId) => {
        if (socketId === socket.id) {
            setStatusColor('red');
            console.log(disconnectedMsg);
            showErrorBar('You have disconnected.');
        } else {
            setStatusColor('orange');
            console.log(disconnectedMsg);
            showErrorBar(disconnectedMsg);
        }
    });

    socket.on('connected1', (connectedMsg, qty, connectedId, codepadValue) => {
        if (qty === 1) {
            setStatusColor('orange');
        } else {
            setStatusColor('green');
            console.log(connectedMsg);
            showSuccessBar(connectedMsg);
        }
        if (connectedId === socket.id) {
            setInitialValue(codepadValue);
        }

    });

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;

        //Monaco Event
        editor.onDidChangeModelContent(e => { //Text Change

            console.log("CodeEditorComponent: onDidChangeModelContent", e, isSocket, isConnected);
            if (isSocket === false && isConnected.current === true) {
                socket.emit("code", ssRef.current, e, editor.getModel().getValue())
            } else {
                isSocket = false
            }

        })

        socket.on('code', function (data) {  //Change Content Event
            isSocket = true
            if (data) {
                changeText(data)
            }
        })

        function changeText(e) {
            if (editor.getModel()) {
                editor.getModel().applyEdits(e.changes) //change Content
            }
        }

    }

    return (
        <div className={'code-editor'}>
            <div className={'top-editor'}><span>&#60;/&#62;&nbsp;</span>Code</div>
            <Editor
                height="90%"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={initialValue}
                onMount={handleEditorDidMount}
            />
            <div className={'bottom-editor'}>
                <div
                    style={{ display: 'flex', alignItems: 'center', marginRight: '10px', color: 'white' }}
                >
                    <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: statusColor,
                        marginRight: '10px'
                    }} />
                    {statusMsg[statusColor]}
                </div>
                <button
                    className={'leave-button'}
                    onClick={() => props.navigate('/home')}
                >
                    Leave
                </button>
            </div>
        </div>
    );

}
