import React, { useEffect, useState } from 'react';
import ButtonMain from '../UI/buttons/ButtonMain'

function SimpleEditor({ code, setCode, onSave }) {

    const [localCode, setLocalCode] = useState(code);

    const handleCodeChange = (event) => {
        setLocalCode(event.target.value);
    };

    useEffect(() => {
        setCode(localCode)

    }, [localCode])


    const handleKeyDown = (event) => {
        const { key, target } = event;
        const { selectionStart, selectionEnd } = target;

        // Use localCode for current state
        const currentCode = localCode;

        if (key === 'Tab') {
            event.preventDefault();
            const beforeTab = currentCode.substring(0, selectionStart);
            const afterTab = currentCode.substring(selectionEnd);
            // Update using localCode
            setLocalCode(beforeTab + "\t" + afterTab);
            // Adjust cursor position
            target.selectionStart = target.selectionEnd = selectionStart + 1;
        } else if (key === 'Enter') {
            event.preventDefault();
            const beforeEnter = currentCode.substring(0, selectionStart);
            const afterEnter = currentCode.substring(selectionEnd);
            const lineStart = beforeEnter.lastIndexOf("\n") + 1;
            const currentIndentation = beforeEnter.substring(lineStart).match(/^\s*/)[0];
            const endsWithColon = beforeEnter.trim().endsWith(":");

            // New line indentation based on condition
            const newLineIndentation = endsWithColon ? currentIndentation + "\t" : currentIndentation;
            // Update using localCode
            const newCode = `${beforeEnter}\n${newLineIndentation}${afterEnter}`;

            setLocalCode(newCode);

            // Adjust cursor position after async state update
            const newPos = selectionStart + newLineIndentation.length + 1; // +1 for the newline
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = newPos;
            }, 0);
        }
    };

    return (
        <div>
            <textarea
                value={localCode}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                placeholder="Write some Python code here..."
                style={{ fontFamily: 'monospace' }}
                className='min-w-[200px] w-full min-h-[200px] resize-y bg-gray-50 ring-1 rounded-lg p-2'
            />
            <div className='w-full flex justify-end items-center'>
                <div className='w-24'>
                    <ButtonMain children={"Save"} onClick={onSave} />
                </div>
            </div>
        </div>
    );
}

export default SimpleEditor;
