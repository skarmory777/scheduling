import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Services from './pages/Services';
import Booking from './pages/Booking';
import MyAppointments from './pages/MyAppointments';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/login"} component={Login} />
          <Route path={"/register"} component={Register} />
          <Route path={"/forgot-password"} component={ForgotPassword} />
          <Route path={"/reset-password"} component={ResetPassword} />
          <Route path={"/404"} component={NotFound} />

          <Route path={"/dashboard"} component={Dashboard} />
          <Route path={"/services"} component={Services} />
          <Route path={"/booking"} component={Booking} />
          {/*<Route path={"/booking/:serviceId"} component={Booking} />*/}
          <Route path={"/appointments"} component={MyAppointments} />
          <Route path={"/admin-dashboard"} component={AdminDashboard} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
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
        defaultTheme="light"
      // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
