import React, { createContext, useEffect, useState } from "react";
import Home from "../pages/home/Home";
import Header from "../components/Header";

export const AppContext = createContext();

export default function AppProvider() {
  const [appState, setAppState] = useState("Home");
  const [localServerUrl, setLocalServerUrl] = useState("127.0.0.1:8000");

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
          localServerUrl
        }}
      >
        <Header />

        {cmpByState[appState]}
      </AppContext.Provider>
    </div>
  );
}
