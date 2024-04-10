import './CollabComponent.scss'
import {useRef, useEffect, useState} from 'react';
import Editor from "@monaco-editor/react";
import firebase from "./firebaseConfig";


export default function CodeEditorComponent() {
    //
    const editorRef = useRef(null);
    const [editorLoaded, setEditorLoaded] = useState(false);


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        setEditorLoaded(true);
    }

    const partnerName = "partner";
    //
    useEffect(() => {
        if (!editorLoaded) {
            return;
        }

        const matchId = "amber"
        const dbRef = firebase.database().ref().child(matchId); // Can be anything in param, use unique string for


        window.Firepad.fromMonaco(dbRef, editorRef.current, {});


    }, [editorLoaded]);

    return (
        <div className={'code-editor'}>
            <div className={'top-editor'}><span>&#60;/&#62;&nbsp;</span> code</div>
            <Editor
                height="90%"
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
