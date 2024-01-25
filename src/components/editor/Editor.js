import React, { useContext, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { python } from "@codemirror/lang-python";
import { AppContext } from "../../provider/appProvider";
import { ZoomIn, ZoomOut } from "@mui/icons-material";


// const { ipcRenderer } = window.require('electron');
// const fs = window.require('fs');
// const path = window.require('path');


function Editor() {


    const { } = useContext(AppContext)


    // const { isDark, setIsDark, setError, setErrorMessage } = useContext(AppContext);
    const [fontSize, setFontSize] = useState(14);  // Imposta la dimensione del font iniziale a 14px
    const [theme, setTheme] = useState({ dracula });  // Imposta la dimensione del font iniziale a 14px
    const [code, setCode] = useState("");


    const zoomIn = () => {
        setFontSize(prevFontSize => prevFontSize + 2);  // Aumenta la dimensione del font di 2px
    };

    const zoomOut = () => {
        setFontSize(prevFontSize => Math.max(prevFontSize - 2, 8));  // Diminuisce la dimensione del font di 2px, ma non meno di 8px
    };



    //     useEffect(() => {
    //     { isDark ? setTheme(dracula) : setTheme(eclipse) }
    // }, [isDark])

    return (
        <div className="flex">
            <div className="w-full">
                <div className="flex justify-between items-center pb-1">

                    <div className="flex items-center">
                        <div onClick={zoomIn} className="text-gray-600 cursor-pointer dark:text-gray-400">
                            <ZoomIn />
                        </div>
                        <div onClick={zoomOut} className="text-gray-600 cursor-pointer dark:text-gray-400">
                            <ZoomOut />
                        </div>
                        {/* <div onClick={() => setStudioState("Strategy")} className="text-gray-600 cursor-pointer dark:text-gray-400 pl-2">
                            <FolderSharp />
                        </div>  */}
                    </div>
                    {/* <div className="font-mono dark:text-text-dark">
                        {selectedStrategy}
                    </div>
                    <div className="flex items-center">
                        <div className="text-gray-600 cursor-pointer dark:text-gray-400 mr-1" title="Run" onClick={handleRunStrategy}>
                            <PlayArrowSharp />
                        </div>
                        <div className="text-gray-600 cursor-pointer dark:text-gray-400 mr-1" title="Reset Template" onClick={handleResetTemplate}>
                            <RecyclingSharp />
                        </div>
                        <div className="text-gray-600 cursor-pointer dark:text-gray-400" title="Save" onClick={handleSaveStrategy}>
                            <SaveSharp />
                        </div>
                    </div> */}
                </div>

                <div className="w-full  text-text-light dark:text-text-dark font-mono ">
                    <CodeMirror
                        value={code}
                        theme={theme}
                        height="calc(100vh - 110px)"
                        extensions={[python()]}
                        // onChange={(editor, data, value) => {
                        //     handleEditorChange()
                        // }}
                        onChange={(value) => setCode(value)}
                        style={{ fontSize: `${fontSize}px`, outline: 'none' }}
                        readOnly={false}
                    />
                </div>
            </div>
        </div>
    );
}
export default Editor;