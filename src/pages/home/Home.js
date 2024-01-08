import { useEffect } from "react";

import "./index.css";
import LogInOverlay from "../../components/overlay/LogInOverlay";
import SignUpOverlay from "../../components/overlay/SignUpOverlay";
const { ipcRenderer } = window.require("electron");

export default function Home() {
  // const { serverUrl, token } = useContext(AppContext);
  // const [name, setName] = useState("Home1")

  useEffect(() => {
    ipcRenderer.send("say-hello", "hello!");

    ipcRenderer.once("hello", (event, response) => {
      console.log("ipcMain said:", response);
    });
  }, []);

  return (
    <div className={"main"}>
      <LogInOverlay />
      <SignUpOverlay />
    </div>
  );
}
