import {useRef, useEffect, useState} from 'react';
import Editor from "@monaco-editor/react";
import firebase from "./firebaseConfig";

export default function CollabComponent() {
    //
    const editorRef = useRef(null);
    const [editorLoaded, setEditorLoaded] = useState(false);


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        setEditorLoaded(true);
    }

    //
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
        <div>
            <Editor
                height="90vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue=""
                onMount={handleEditorDidMount}
            />
        </div>
    );

}
