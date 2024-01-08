// in preload.js
// these methods are loaded before the main process start.
// they are only examples and is used to handle the window maximize, minimize and quit.
// those operation can also (and more efficiently) handled by ipcMain!!

const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const waitForElement = (elementId, callback) => {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
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

  waitForElement("closeApp", (element) => {
    element.addEventListener("click", () => {
      ipcRenderer.invoke("hide-app");
    });
  });
  waitForElement("maximizeApp", (element) => {
    element.addEventListener("click", () => {
      ipcRenderer.invoke("maximize-app");
    });
  });
  waitForElement("minimizeApp", (element) => {
    element.addEventListener("click", () => {
      ipcRenderer.invoke("minimize-app");
    });
  });
});
