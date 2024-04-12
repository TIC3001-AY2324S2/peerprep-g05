import './CollabComponent.scss'
import {useRef, useEffect, useState} from 'react';
import Editor from "@monaco-editor/react";
import {socket} from "../../apis/socket";


export default function CodeEditorComponent(props) {
    //
    const editorRef = useRef(null);
    const isConnected = useRef(false)
    let isSocket = false;

    // Reference: https://github.com/tbvjaos510/monaco-editor-socket-io/blob/master/server/public/js/monaco.js#L84

    const sessionId = props.matchSessionHash;
    const ssRef = useRef(sessionId);
    useEffect(() => {
        if (sessionId && sessionId !== '') {
            socket.emit("joinSession", sessionId);
            isConnected.current = true
            ssRef.current = sessionId;
        }
    }, [sessionId]);
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;

        //Monaco Event
        editor.onDidChangeModelContent(e => { //Text Change

            console.log("CodeEditorComponent: onDidChangeModelContent", e, isSocket, isConnected);
            if (isSocket === false && isConnected.current === true) {
                console.log("CodeEditorComponent: emit code", ssRef.current, e);
                socket.emit("code", ssRef.current, e)
            } else {
                isSocket = false
            }

        })

        socket.on('code', function (data) {  //Change Content Event
            isSocket = true
            changeText(data)
        })

        function changeText(e) {
            editor.getModel().applyEdits(e.changes) //change Content
        }

    }


    return (
        <div className={'code-editor'}>
            <div className={'top-editor'}><span>&#60;/&#62;&nbsp;</span>Code</div>
            <Editor
                height="85%"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue=""
                onMount={handleEditorDidMount}
            />
            <div className={'bottom-editor'}>
                <button className={'run-button'}>Execute</button>
            </div>
        </div>
    );

}
