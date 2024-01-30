
import "./index.css";
// const { ipcRenderer } = window.require("electron");

export default function Home() {
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
      <div className="h-[105vh]">
        <iframe src='https://my.spline.design/interactivesparkletterwithparticleeffectcopy-371a9aa1dd45ba33b88383284d7a637c/' frameborder='0' width='100%' height='100%'></iframe>
      </div>
    </div>
  );
}
