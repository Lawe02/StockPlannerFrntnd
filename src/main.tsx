// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.tsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={process.env.AUTH0_DOMAIN || ""}
    clientId={process.env.AUTH0_CLIENT_ID || ""}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: process.env.AUTH0_AUDIENCE,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Auth0Provider>
);
