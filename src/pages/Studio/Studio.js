
import FlowPage from "../../components/flow/FlowPage";
// const { ipcRenderer } = window.require("electron");

export default function Studio() {
    // const { serverUrl, token } = useContext(AppContext);
    // const [name, setName] = useState("Home1")

    // useEffect(() => {
    //   ipcRenderer.send("say-hello", "hello!");

    //   ipcRenderer.once("hello", (event, response) => {
    //     console.log("ipcMain said:", response);
    //   });
    // }, []);

    return (
        <div className={"main"}>
            {/* <LogInOverlay /> */}
            {/* <SignUpOverlay /> */}
            <div className="w-full h-[calc(100vh-38px)]">
                <FlowPage />
            </div>

        </div>
    );
}
