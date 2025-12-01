
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="200378083336-1pa3jlp7fh21i66sfuftqch1cf97humh.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
