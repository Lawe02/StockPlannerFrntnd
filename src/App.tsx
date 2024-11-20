import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import CreatePlan from "./components/createPlan";
import PlansList from "./components/planList/planList";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Navbar />
      <CreatePlan />
      {isAuthenticated && <PlansList />}
    </>
  );
}

export default App;
