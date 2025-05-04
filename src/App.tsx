import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RoutesIndex } from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const GOOGLE_CLIENT_ID =
    "1073301308996-9a8ek2s3k2pku7dklmjct0bgurolltco.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <RoutesIndex />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
