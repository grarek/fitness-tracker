import { createRoot } from "react-dom/client";
import { storage } from "./storage";
import App from "./App";

// Install the storage shim so tracker code can use window.storage
(window as any).storage = storage;

createRoot(document.getElementById("root")!).render(<App />);
