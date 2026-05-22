// src/dashboard/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Updated path
import { useLanguage } from "../../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Validation
    if (!email || !password) {
      setError(
        language === "arabic"
          ? "الرجاء إدخال البريد الإلكتروني وكلمة المرور"
          : "Please enter email and password",
      );
      setLoading(false);
      return;
    }
    try {
      // Make sure you're passing email and password
      const result = await login({
        email: email, // Make sure field name is 'email'
        password: password, // Make sure field name is 'password'
      });

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        navigate("/dashboard");
      } else {
        // Display the error message from the API
        setError(
          result.error ||
            (language === "arabic"
              ? "بيانات الاعتماد غير صحيحة"
              : "Invalid credentials"),
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        language === "arabic"
          ? "حدث خطأ أثناء تسجيل الدخول"
          : "An error occurred during login",
      );
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Demo credentials - Updated to match your seeded user
  const fillDemoCredentials = () => {
    setEmail("admin@qwhlegal.com");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lawyer-primary to-lawyer-secondary p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-lawyer-primary to-lawyer-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <span className="text-3xl">⚖️</span>
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-lawyer-primary">
            {language === "arabic" ? "تسجيل الدخول" : "Dashboard Login"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {language === "arabic"
              ? "قم بتسجيل الدخول لإدارة موقعك"
              : "Sign in to manage your website"}
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm flex items-start gap-2"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="flex-1">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              {language === "arabic" ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all pl-10"
                placeholder="admin@qwhlegal.com"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              {language === "arabic" ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-lawyer-accent focus:ring-2 focus:ring-lawyer-accent/20 transition-all pl-10 pr-12"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-lawyer-accent border-gray-300 rounded focus:ring-lawyer-accent"
              />
              <span className="ml-2 text-sm text-gray-600">
                {language === "arabic" ? "تذكرني" : "Remember me"}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-lawyer-accent to-lawyer-gold text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {language === "arabic"
                    ? "جاري تسجيل الدخول..."
                    : "Signing in..."}
                </span>
              </div>
            ) : (
              <span>{language === "arabic" ? "تسجيل الدخول" : "Sign In"}</span>
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              {language === "arabic" ? "بيانات تجريبية" : "Demo Credentials"}
            </p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-lawyer-accent hover:text-lawyer-primary transition-colors inline-flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {language === "arabic"
                ? "استخدام بيانات تجريبية"
                : "Use demo credentials"}
            </button>
            <div className="mt-2 text-xs text-gray-400">
              <span>admin@qwhlegal.com / password123</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2024 QWH Legal.{" "}
            {language === "arabic"
              ? "جميع الحقوق محفوظة"
              : "All rights reserved."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
