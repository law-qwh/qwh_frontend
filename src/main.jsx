// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Main website components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

// Dashboard components
import DashboardLayout from "./dashboard/components/DashboardLayout";
import ProtectedRoute from "./dashboard/components/ProtectedRoute";
import Login from "./dashboard/pages/Login";
import DashboardHome from "./dashboard/pages/DashboardHome";
import HeroSection from "./dashboard/pages/HeroSection";
import ServicesManagement from "./dashboard/pages/ServicesManagement";
import FeaturedServices from "./dashboard/pages/FeaturedServices";
import StatsManagement from "./dashboard/pages/StatsManagement";
import AboutPage from "./dashboard/pages/AboutPage";
import TeamManagement from "./dashboard/pages/TeamManagement";
import ContactMessages from "./dashboard/pages/ContactMessages";
import Settings from "./dashboard/pages/Settings";

// Wrapper for main website
const MainWebsiteLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const router = createBrowserRouter([
  // Main website routes
  {
    path: "/",
    element: (
      <MainWebsiteLayout>
        <Home />
      </MainWebsiteLayout>
    ),
  },
  {
    path: "/about",
    element: (
      <MainWebsiteLayout>
        <About />
      </MainWebsiteLayout>
    ),
  },
  {
    path: "/services",
    element: (
      <MainWebsiteLayout>
        <Services />
      </MainWebsiteLayout>
    ),
  },
  {
    path: "/contact",
    element: (
      <MainWebsiteLayout>
        <Contact />
      </MainWebsiteLayout>
    ),
  },
  // Dashboard routes
  {
    path: "/dashboard/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "hero", element: <HeroSection /> },
      { path: "services", element: <ServicesManagement /> },
      { path: "featured-services", element: <FeaturedServices /> },
      { path: "stats", element: <StatsManagement /> },
      { path: "about", element: <AboutPage /> },
      { path: "team", element: <TeamManagement /> },
      { path: "contact", element: <ContactMessages /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
