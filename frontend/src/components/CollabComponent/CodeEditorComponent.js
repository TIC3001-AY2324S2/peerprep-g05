import './CollabComponent.scss'
import {useRef, useEffect, useState} from 'react';
import Editor from "@monaco-editor/react";
import {socket} from "../../apis/socket";


export default function CodeEditorComponent() {
    //
    const editorRef = useRef(null);
    const [isConnected, setIsConnected] = useState(socket.connected);
    let issocket = false;

    // Reference: https://github.com/tbvjaos510/monaco-editor-socket-io/blob/master/server/public/js/monaco.js#L84

    const sessionId = "amber";

    function handleEditorDidMount(editor) {
        editorRef.current = editor;
        setIsConnected(true);

        socket.emit("joinSession", sessionId);

        //Monaco Event
        editor.onDidChangeModelContent(function (e) { //Text Change
            if (issocket === false) {
                socket.emit('code', sessionId, e)
            } else {
                issocket = false
            }

        })

        socket.on('code', function (data) {  //Change Content Event
            issocket = true
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
