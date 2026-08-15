import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RoleProvider } from "./contexts/RoleContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import { Identity, Objects, OntologyStudio } from "./pages/SemanticPages";
import { Access, Connectors, Gateway } from "./pages/OperationsPages";
import { Decision, OagAssistant } from "./pages/DecisionPages";
import { Governance } from "./pages/GovernancePage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/objects"} component={Objects} />
      <Route path={"/ontology"} component={OntologyStudio} />
      <Route path={"/connectors"} component={Connectors} />
      <Route path={"/oag"} component={OagAssistant} />
      <Route path={"/decision"} component={Decision} />
      <Route path={"/governance"} component={Governance} />
      <Route path={"/identity"} component={Identity} />
      <Route path={"/gateway"} component={Gateway} />
      <Route path={"/access"} component={Access} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <RoleProvider>
            <DashboardLayout>
              <Router />
            </DashboardLayout>
          </RoleProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
