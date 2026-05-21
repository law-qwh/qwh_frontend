import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
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

const MainWebsiteLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Main website routes */}
            <Route
              path="/"
              element={
                <MainWebsiteLayout>
                  <Home />
                </MainWebsiteLayout>
              }
            />
            <Route
              path="/about"
              element={
                <MainWebsiteLayout>
                  <About />
                </MainWebsiteLayout>
              }
            />
            <Route
              path="/services"
              element={
                <MainWebsiteLayout>
                  <Services />
                </MainWebsiteLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainWebsiteLayout>
                  <Contact />
                </MainWebsiteLayout>
              }
            />

            {/* Dashboard routes */}
            <Route path="/dashboard/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="hero" element={<HeroSection />} />
              <Route path="services" element={<ServicesManagement />} />
              <Route path="featured-services" element={<FeaturedServices />} />
              <Route path="stats" element={<StatsManagement />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="team" element={<TeamManagement />} />
              <Route path="contact" element={<ContactMessages />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
