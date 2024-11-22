import { useAuth0 } from "@auth0/auth0-react";

const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0(); // updated usage

  return isAuthenticated ? (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => {
        logout();
      }}
    >
      Log Out
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-primary ml-auto"
      onClick={() => loginWithRedirect()}
    >
      Get Started
    </button>
  );
};
export default AuthButton;
