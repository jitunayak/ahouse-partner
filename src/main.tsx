import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// Import the generated route tree
import { AptabaseProvider } from "@aptabase/react";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ThemeProvider } from "./components/theme.provider";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AptabaseProvider
        appKey="A-US-3749439299"
        options={{ appVersion: "0.1.0" }}
      >
        <ThemeProvider
          defaultTheme="light"
          storageKey="partner-ahouse-ui-theme"
        >
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
        </ThemeProvider>
      </AptabaseProvider>
    </StrictMode>
  );
}
