import { EditorState } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { useState } from "react";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { DOMParser } from "prosemirror-model";
import Header from './Header.js'
import { schema } from "./Schemas.js";
import { amendTransaction } from "./trackChanges.js";
import { chainCommands, deleteSelection, joinBackward, selectNodeBackward, newlineInCode, createParagraphNear, splitBlock, } from "prosemirror-commands"
import { undo, redo, history } from "prosemirror-history"
import { react } from "@nytimes/react-prosemirror";
import "prosemirror-view/style/prosemirror.css"

const backspace = chainCommands(deleteSelection, joinBackward, selectNodeBackward)
const enterCommand = chainCommands(newlineInCode, createParagraphNear, splitBlock);

const addInputType = (tr, inputType) => tr.setMeta("inputType", inputType)

const keymapPlugin = keymap({
    "Backspace": (state, dispatch, view) => backspace(state, tr => dispatch(addInputType(tr, "deleteContentBackward")), view),
    "Delete": (state, dispatch, view) => backspace(state, tr => dispatch(addInputType(tr, "deleteContentBackward")), view),
    "Mod-z": (state, dispatch, view) => undo(state, tr => dispatch(addInputType(tr, "historyUndo")), view),
    "Shift-Mod-z": (state, dispatch, view) => redo(state, tr => dispatch(addInputType(tr, "historyRedo")), view),
    "Enter": enterCommand,
    "Mod-Enter": enterCommand,
    ...baseKeymap,
});


// Sample data as a string in Markdown or HTML
const sampleData = "<p>Hello, this is a <strong>ProseMirror</strong> editor!</p>";

// Convert sample data to a ProseMirror document
const tempElement = document.createElement('div');
tempElement.innerHTML = sampleData;
const doc = DOMParser.fromSchema(schema).parse(tempElement);



function ProseMirrorEditor() {
    const [mount, setMount] = useState(null);

    const intital = EditorState.create({
        doc: doc,
        schema,
        plugins: [
            history(),
            keymapPlugin,
            react(),
        ]
    })
    const [state, setState] = useState(intital);

    const dispatchTransaction = (tr) => {
        console.log("tr", tr)
        const amendedTransaction = amendTransaction(tr, state, { id: "user1", username: "Editor1" }, 0);
        const { state: newState, transactions } = state.applyTransaction(amendedTransaction)
        console.log("newState", newState, state)
        setState(newState)
        // setState((s) => s.apply(amendedTransaction));

    };


    return (
        <ProseMirror
            mount={mount}
            state={state}
            dispatchTransaction={dispatchTransaction}
        >
            <Header />
            <div ref={setMount} />
        </ProseMirror>
    );
}

export default ProseMirrorEditor