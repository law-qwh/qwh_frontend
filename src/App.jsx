// src/App.jsx
import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext"; // Use the correct one
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import DashboardLayout from "./dashboard/DashboardLayout";
import Login from "./dashboard/pages/Login";
import ProtectedRoute from "./dashboard/components/ProtectedRoute";
import { useLanguage } from "./contexts/LanguageContext";
import { useEffect } from "react";

function App() {
  const { language } = useLanguage();
  useEffect(() => {
    // Update html attributes based on language
    if (language === "arabic") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
      document.body.style.fontFamily = "'Ciro', 'Tahoma', sans-serif";
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", "en");
      document.body.style.fontFamily = "'Inter', system-ui, sans-serif";
    }
  }, [language]);
  return (
    <LanguageProvider>
      <AuthProvider>
        {" "}
        {/* Make sure AuthProvider is here */}
        <HashRouter>
          <ScrollToTop />
          <Routes>
            {/* Main Website Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <About />
                  <Footer />
                </>
              }
            />
            <Route
              path="/services"
              element={
                <>
                  <Navbar />
                  <Services />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <Contact />
                  <Footer />
                </>
              }
            />

            {/* Dashboard Routes */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
