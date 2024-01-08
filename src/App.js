import AppProvider from "./provider/appProvider";

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
