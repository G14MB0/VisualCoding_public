// in preload.js
const { ipcRenderer } = require('electron');


window.addEventListener('DOMContentLoaded', () => {

    const waitForElement = (elementId, callback) => {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const element = document.getElementById(elementId);
                    if (element) {
                        observer.disconnect();
                        callback(element);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    waitForElement('closeApp', (element) => {

        element.addEventListener('click', () => {
            ipcRenderer.invoke('quit-app');
        });
    });
    waitForElement('maximizeApp', (element) => {

        element.addEventListener('click', () => {
            ipcRenderer.invoke('maximize-app');
        });
    });
    waitForElement('minimizeApp', (element) => {

        element.addEventListener('click', () => {
            ipcRenderer.invoke('minimize-app');
        });
    });
});