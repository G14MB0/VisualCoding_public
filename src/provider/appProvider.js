import React, { createContext, useEffect, useState } from "react";
import Home from "../pages/home/Home";
import Header from "../components/Header";

import FullOverlay from "../components/overlay/FullOverlay";
import { ReactFlowProvider, useEdgesState, useNodesState } from "reactflow";
import Trace from "../pages/Trace/Trace";
import Studio from "../pages/Studio/Studio";
import Setting from "../pages/setting/Setting";

export const AppContext = createContext();

const initialNodes = [];
const initialEdges = [];

export default function AppProvider() {
  //The app state, used by header to change the main state
  const [appState, setAppState] = useState("Home");
  //A global state to handle the eventual server URL and port
  const [localServerUrl, setLocalServerUrl] = useState("127.0.0.1");
  const [localServerPort, setLocalServerPort] = useState("12345");

  //Login state
  const [isLogged, setIsLogged] = useState(false);
  //used to set the JWT token
  const [reload, setReload] = useState(false);
  const [sideBarReload, setSideBarReload] = useState(null);
  const [componentReload, setComponentReload] = useState(null);

  //used to open the login and signup form
  const [openLogin, setOpenLogin] = useState(false);
  const [OpenSignUp, setOpenSignUp] = useState(false);

  // Open/Close the full overlay
  const [overlay, setOverlay] = useState(false);
  // State variable to hold the component to be rendered in FullOverlay
  const [overlayComponent, setOverlayComponent] = useState({
    Component: null,
    props: {}, // Initial props (empty object or some default props)
  });

  // used as a global state for saving to backend
  const [save, setSave] = useState(false)
  const [fileUsed, setFileUsed] = useState("")

  const [isDebug, setIsDebug] = useState(false)
  const [isRunning, setIsRunning] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // History state to keep track of past node and edge states
  const [history, setHistory] = useState({ nodes: [], edges: [], currentIndex: -1 });

  const [globalWs, setGlobalWs] = useState(null);
  const [activeNode, setActiveNode] = useState({});

  useEffect(() => {
    console.log(reload)

  }, [reload])


  //sono tutte le mie 'pagine'
  const cmpByState = {
    Home: <Home />,
    Trace: <Trace />,
    Studio: <Studio />,
    Settings: <Setting />
  };

  return (
    // Defined the ReactFlowProvider Here to have access to its state everywhere in the appContext
    <div>
      <ReactFlowProvider>
        <AppContext.Provider
          value={{
            appState,
            setAppState,
            isLogged,
            setIsLogged,
            reload,
            setReload,
            openLogin,
            setOpenLogin,
            OpenSignUp,
            setOpenSignUp,
            localServerUrl,
            setLocalServerUrl,
            localServerPort,
            setLocalServerPort,
            overlay,
            setOverlay,
            overlayComponent,
            setOverlayComponent,
            save,
            setSave,
            fileUsed, setFileUsed,
            sideBarReload, setSideBarReload,
            componentReload, setComponentReload,
            isDebug, setIsDebug,
            setIsRunning, isRunning,
            nodes, setNodes, onNodesChange,
            edges, setEdges, onEdgesChange,
            history, setHistory,
            globalWs, setGlobalWs,
            activeNode, setActiveNode
          }}
        >
          <Header />
          <FullOverlay
            Component={overlayComponent.Component}
            {...overlayComponent.props}
          />
          {cmpByState[appState]}
        </AppContext.Provider>
      </ReactFlowProvider>
    </div>
  );
}
