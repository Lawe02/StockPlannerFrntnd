import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "./auth";

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
            <p className="user-greeting">Hello, {user?.email}</p>
          )}
          <AuthButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
