import React from 'react'
import { useEditorEventCallback } from "@nytimes/react-prosemirror"
import { toggleMark } from "prosemirror-commands";

export default function Header() {
    const toggleItalic = useEditorEventCallback((view) => {
        const toggleItalicMark = toggleMark(view.state.schema.marks["italic"]);
        toggleItalicMark(view.state, view.dispatch, view);
    });

    const toggleBold = useEditorEventCallback((view) => {
        const toggleBoldMark = toggleMark(view.state.schema.marks["bold"]);
        toggleBoldMark(view.state, view.dispatch, view);
    });



    return (
        <div>
            <button onClick={() => toggleBold()} >
                B
            </button>
            <button onClick={toggleItalic}>
                I
            </button>
        </div>
    )
}
