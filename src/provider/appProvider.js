import React, { createContext, useEffect, useState } from "react";
import Home from "../pages/home/Home";
import Header from "../components/Header";

export const AppContext = createContext();

export default function AppProvider() {
  //The app state, used by header to change the main state
  const [appState, setAppState] = useState("Home");
  //A global state to handle the eventual server URL and port
  const [localServerUrl, setLocalServerUrl] = useState("127.0.0.1");
  const [localServerPort, setLocalServerPort] = useState("8000");

  //Login state
  const [isLogged, setIsLogged] = useState(false);
  //used to set the JWT token
  const [reload, setReload] = useState(null);
  //used to open the login and signup form
  const [openLogin, setOpenLogin] = useState(false);
  const [OpenSignUp, setOpenSignUp] = useState(false);

  //sono tutte le mie 'pagine'
  const cmpByState = {
    Home: <Home />,
  };

  return (
    <div>
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
        }}
      >
        <Header />

        {cmpByState[appState]}
      </AppContext.Provider>
    </div>
  );
}
