import AppProvider from "./provider/appProvider";
import { useEffect, useState } from "react";


function App() {

  // useEffect(() => {
  //   localStorage.removeItem('myToken')
  // }, [])


  return (
    <>
      <AppProvider />
    </>
  );
}

export default App;
