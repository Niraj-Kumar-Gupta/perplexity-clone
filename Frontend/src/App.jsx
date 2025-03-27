import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PrivateRoute from "./Routes/PrivateRoute";
import PublicRoute from './Routes/PublicRoute';
import { RoutePaths } from "./constants/routes";

import "./App.css";

// Lazy Load Components
const Navbar = lazy(() => import("./Layout/Navbar/Navbar"));
const Dashboard = lazy(() => import("./Routes/Dashboard/Dashboard"));
const GenAiChat = lazy(() => import("./Routes/GenAIChat/GenAiChat"));
const ChatApp = lazy(() => import("./Routes/ChatApp/ChatApp"));
const Signup = lazy(() => import("./Routes/Signup/Signup"));
const Login = lazy(() => import("./Routes/Login/Login"));
const ForgotPassword = lazy(() => import("./Routes/ForgotPassword/ForgotPassword"));
const NotFound = lazy(() => import("./Routes/NotFound/NotFound"));

// Loading Spinner
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
  </div>
);

// Page transition animation
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

// Ensure Suspense wraps Lazy Components
const AnimatedPage = ({ children }) => (
  <motion.div {...pageTransition}>
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  console.log("Current Path:", location.pathname);

  const shouldShowNavbar =  !(location.pathname.startsWith(RoutePaths.CHAT))

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {shouldShowNavbar && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path={RoutePaths.HOME} element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path={RoutePaths.CHAT} element={<GenAiChat />} />
            <Route path={RoutePaths.CHAT_DETAILS} element={<GenAiChat />} />
            <Route path={'/test'} element={<AnimatedPage><ChatApp /></AnimatedPage>} />
          </Route>
          
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path={RoutePaths.SIGNUP} element={<AnimatedPage><Signup /></AnimatedPage>} />
            <Route path={RoutePaths.LOGIN} element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path={RoutePaths.RESET_PASSWORD} element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
            <Route path={RoutePaths.PASSWORD_RESET_CONFIRM} element={<AnimatedPage><ForgotPassword reset /></AnimatedPage>} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
