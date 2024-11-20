import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import CreatePlan from "./components/createPlan";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Navbar />
      {isAuthenticated && <CreatePlan />}
    </>
  );
}

export default App;
