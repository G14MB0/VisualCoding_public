const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { spawn } = require("child_process");
const child_process = require("child_process");
const kill = require("tree-kill");
const { autoUpdater } = require("electron-updater");
const bonjour = require("bonjour")();

const BACKEND_PATH = "server\\R2F_0_1_0\\R2F_0_1_0.exe"; //the relative path from root folder of backend executable (if executable)
const CLOSE_ALL_TIMEOUT = 3000; // how many ms to wait until close the fronend if backend can't be closed.
const checkForUpdatesInterval = 5 * 60 * 1000; // Check every 5 min. If set to 0, it runs only at startup
const serverPort = 12346; // make sure is the same as in the "start" react snippet in package.json

let _avoidOverStarting = 0

async function discoverUpdateServer() {
  return new Promise((resolve, reject) => {
    // Find all HTTP servers on the local network
    bonjour.find({ type: "http" }, function (service) {
      console.log(service);
      if (service.name === "MyFastAPIServer") {
        resolve(service.referer.address); // Resolve the promise with the address
      }
    });

    // Set a timeout to reject the promise if the server isn't found
    setTimeout(() => {
      reject("Server not found");
    }, 10000); // Adjust timeout as needed
  });
}

// This function is used as a AutoUpdater setup.
// it calls discoverUpdateServer to find the IP of a service in the local network
// that match the service.name.
// USE THIS IF UPDATE SERVER IS IN LOCAL NETWORK!!!
async function setupAutoUpdater() {
  try {
    const serverPort = 12345;
    const serverIP = await discoverUpdateServer(); // Replace with your actual discovery function
    const feedURL = `http://${serverIP}:${serverPort}/downloads`; // Adjust the port and path as necessary

    console.log(feedURL);
    autoUpdater.setFeedURL(feedURL);

    autoUpdater.on("update-available", () => {
      console.log("Update available.");
    });

    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
      // Trigger the update process
      autoUpdater.quitAndInstall();
    });

    autoUpdater.on("error", (error) => {
      console.error("Error in auto-updater:", error);
    });

    autoUpdater.on("download-progress", (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecexcond;
      log_message = log_message + " - Downloaded " + progressObj.percent + "%";
      log_message =
        log_message +
        " (" +
        progressObj.transferred +
        "/" +
        progressObj.total +
        ")";
      console.log(log_message);
    });
    autoUpdater.on("update-downloaded", (info) => {
      console.log("Update downloaded; will install in 5 seconds");
      // Attendi 5 secondi, poi chiudi l'applicazione e installa l'aggiornamento
      setTimeout(() => {
        autoUpdater.quitAndInstall();
      }, 5000);
    });
  } catch (error) {
    console.error("Error setting up autoUpdater:", error);
  }
}

const pathToExe = path.join(app.getAppPath(), `../${BACKEND_PATH}`); //build
// const pathToExe = `${path.join(__dirname, "../server/R2TxVST_R02.exe")}`; //dev

const fs = require("fs");

console.log("Path to exe: ", pathToExe);
console.log("File exists: ", fs.existsSync(pathToExe));

let child = null;
var processes = [];
let outputData = "";
let tray = null;

function getChildProcesses(parentPid, callback) {
  child_process.exec(
    "wmic process get parentprocessid,processid",
    (err, stdout, stderr) => {
      if (err) {
        console.error("Error executing WMIC:", err);
        return callback(err);
      }

      if (stderr) {
        console.error("WMIC STDERR:", stderr);
      }

      const lines = stdout.split("\n");
      const childPids = lines
        .filter((line) => line.includes(parentPid))
        .map((line) => line.replace(parentPid, "").trim());

      console.log("child processes fund: ");
      console.log(childPids);
      return callback(null, childPids);
    }
  );
}

const runExeFile = () => {
  try {
    if (fs.existsSync(pathToExe)) {
      // Adding a process
      console.log("PATH to exe: ");
      console.log(pathToExe);
      const child = spawn(pathToExe, [], {
        stdio: ["ignore", "pipe", "ignore"],
      });

      child.stdout.on("data", (data) => {
        outputData += data.toString();
        console.log("output data: ");
        console.log(outputData);
      });

      processes.push(child);

      child.on("exit", function () {
        processes.splice(processes.indexOf(child), 1);
      });
    }
  } catch (error) {
    // Handle the error by showing a dialog
    console.log("Error", `An error occurred: ${error.message}`);
  }
};

// ipcMain.handle("get-output", async () => {
// 	return outputData;
// });

ipcMain.handle("hide-app", async (event) => {
  event.preventDefault();
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow && !mainWindow.isMinimized() && mainWindow.isVisible()) {
    mainWindow.hide();
  }
});

const handleQuitApp = async () => {
  const choice = 0; // Just an example, you might want this to be an argument.

  console.log("Handling 'quit-app'");
  console.log("start closing all subprocess...");

  try {
    if (choice === 0) {
      for (const proc of processes) {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, CLOSE_ALL_TIMEOUT);

          console.log("killing process: " + proc.pid);

          getChildProcesses(proc.pid, (err, childPids) => {
            if (err) {
              console.error("Failed to get child processes:", err);
              return;
            }

            console.log("All childs pid: " + childPids);

            for (const childProcPid of childPids) {
              kill(childProcPid, "SIGKILL", (err) => {
                if (err) {
                  console.error("Failed to kill process tree:", err);
                  reject(
                    new Error("Failed to kill process tree: " + err.message)
                  );
                  return;
                } else {
                  console.log(
                    "Successfully killed the process tree with starting PID:",
                    childProcPid
                  );
                }
              });
            }

            console.log("now killing the main process: " + proc.pid);
            kill(proc.pid, "SIGTERM", (err) => {
              if (err) {
                console.error("Failed to kill process tree:", err);
                reject(
                  new Error("Failed to kill process tree: " + err.message)
                );
                return;
              } else {
                console.log(
                  "Successfully killed the process tree with starting PID:",
                  proc.pid
                );
                resolve();
              }
            });
          });
        });
      }

      app.quit(); // Ensure app is in scope or passed as an argument to the function.
    }
  } catch (error) {
    console.error("An error occurred in 'handleQuitApp':", error);
    // Optional: You could show a dialog to the user to inform them of the error.
    // dialog.showErrorBox('Error', 'An unexpected error occurred. Please try again or contact support.');
  }
};

ipcMain.handle("minimize-app", () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("maximize-app", () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

function createWindow() {
  const win = new BrowserWindow({
    title: "ready2flow",
    icon: `${__dirname}public/logo.ico`,
    width: 800,
    height: 600,
    minWidth: 400, // set minimum width to 400 pixels
    minHeight: 400, // set minimum height to 300 pixels
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  win.loadURL(
    isDev
      ? `http://localhost:${serverPort}`
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`)
  // Controlla gli aggiornamenti
}

setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify();
}, checkForUpdatesInterval);

app.on("ready", createWindow);
app.on("ready", setupAutoUpdater);


// // Disable reload b ctrl+r
// app.on('browser-window-focus', function () {
//   globalShortcut.register("CommandOrControl+R", () => {
//     console.log("CommandOrControl+R is pressed: Shortcut Disabled");
//   });
//   globalShortcut.register("F5", () => {
//     console.log("F5 is pressed: Shortcut Disabled");
//   });
// });

// app.on('browser-window-blur', function () {
//   globalShortcut.unregister('CommandOrControl+R');
//   globalShortcut.unregister('F5');
// });

app
  .whenReady()
  .then(() => {
    if (_avoidOverStarting === 0) {
      runExeFile();

      console.log("START UPDATE FETCH");
      autoUpdater.checkForUpdatesAndNotify();

      // Ensure only one tray instance is created
      if (!tray) { // Check if tray doesn't already exist
        tray = new Tray(`${__dirname}\\tray.png`);
        const contextMenu = Menu.buildFromTemplate([
          {
            label: "Open",
            click: () => {
              const mainWindow = BrowserWindow.getFocusedWindow();
              mainWindow.show();
            },
          },
          {
            label: "Quit",
            click: () => {
              handleQuitApp();
            },
          },
        ]);
        tray.setToolTip("Ready2floW");
        tray.setContextMenu(contextMenu);
      }
    }
    _avoidOverStarting = 1

  })
  .catch(console.log);

ipcMain.on("say-hello", (event, data) => {
  console.log("ipcMain received:", data);
  event.reply("hello", "Hello from ipcMain!");
});
