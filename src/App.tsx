import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import CreatePlan from "./components/createPlan";
import PlansList from "./components/planList/planList";
import PlanDetails from "./components/plandetails/plandetails"; // Import PlanDetails

function App() {
  return (
    <Router>
      <Navbar />
      <CreatePlan />
      <Routes>
        <Route path="/" element={<PlansList />} /> {/* Plans list */}
        <Route path="/plan/:id" element={<PlanDetails />} />{" "}
        {/* Plan details page */}
      </Routes>
    </Router>
  );
}

export default App;
