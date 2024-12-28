import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import CreatePlan from "./components/createPLan/createPlan";
import PlansList from "./components/planList/planList";
import PlanDetails from "./components/plandetails/plandetails"; // Import PlanDetails
import { useAuth0 } from "@auth0/auth0-react";
import Hero from "./components/hero/hero";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <Navbar />
      {isAuthenticated == false && <Hero />}
      <Routes>
        {isAuthenticated && (
          <Route path="createPlan" element={<CreatePlan />} />
        )}
        {isAuthenticated && <Route path="/" element={<PlansList />} />}
        {isAuthenticated && (
          <Route path="/plan/:id" element={<PlanDetails />} />
        )}
        {/* Plan details page */}
      </Routes>
    </Router>
  );
}

export default App;
