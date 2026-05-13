// src/dashboard/routes.jsx
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import DashboardHome from "./pages/DashboardHome";
import HeroSection from "./pages/HeroSection";
import ServicesManagement from "./pages/ServicesManagement";
import FeaturedServices from "./pages/FeaturedServices";
import StatsManagement from "./pages/StatsManagement";
import AboutPage from "./pages/AboutPage";
import TeamManagement from "./pages/TeamManagement";
import ContactMessages from "./pages/ContactMessages";
import Settings from "./pages/Settings";

export const dashboardRouter = createBrowserRouter([
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
