// import GoodsList from "./views/GoodsList";
// import Admin from "./views/Admin";

function App(props) {
  return <div>
    {/*<GoodsList></GoodsList>*/}
    {/*<Admin></Admin>*/}
    {props.children}
  </div>;
}

export default App;
