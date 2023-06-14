// import { useContext, useState } from "react";
// import { AppContext } from "../../provider/appProvider";
import "./index.css";
import LogInOverlay from "../../components/overlay/LogInOverlay";
import SignUpOverlay from "../../components/overlay/SignUpOverlay";


export default function Home() {
  // const { serverUrl, token } = useContext(AppContext);
  // const [name, setName] = useState("Home1")

  
  return (
    <div className={"main"}>
      <LogInOverlay />
      <SignUpOverlay />
    </div>
  );
}
