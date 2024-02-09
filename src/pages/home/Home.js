
import "./index.css";
// const { ipcRenderer } = window.require("electron");
const uniqueKey = Date.now();
const iframeSrc = `https://my.spline.design/interactivesparkletterwithparticleeffectcopycopy-8783de6d9ea58904d105bd9f6a46e0aa/?key=${uniqueKey}`;

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
    <div className={"main dark:bg-slate-950"}>
      <div className="h-[105vh]  dark:bg-slate-950">
        <iframe className="scale-20" src={iframeSrc} frameborder='0' width='100%' height='100%'></iframe>
      </div>
    </div>
  );
}
