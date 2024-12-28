import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "../authBtn/auth";
import "./navbar.css";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <nav className="navbar">
      <ul className="navbar-container">
        <li className="navbar-item navbar-brand">
          <a href="#">PortfolioPlannr</a>
        </li>
        <li className="navbar-item user-info">
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <p className="user-greeting text-sm font-medium">
                Hello, {user?.email}
              </p>
              <AuthButton />
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
