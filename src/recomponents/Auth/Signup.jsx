import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import billo from "../../assets/billo.png";
// import sujal2 from "../../assets/sujal2.png";
// import sameer from "../../assets/sameer.png";
// import bistey from "../../assets/bistey.png";
// import srijan from "../../assets/srijan.png";

export default function BilloChatSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup, googleLogin, facebookLogin, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate("/chat");
    }
  }, [currentUser, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup(email, password, firstName, lastName);
      navigate("/chat");
    } catch (error) {
      setError(error.message);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/chat");
    } catch (error) {
      setError(error.message);
      console.error("Google login error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookLogin();
      navigate("/chat");
    } catch (error) {
      setError(error.message);
      console.error("Facebook login error:", error);
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom right, #27187E, #3726A6, #1B1464)",
      }}
      className="h-[100vh] w-full relative overflow-hidden"
    >
      {/* Background elements - hidden on mobile */}
      <div className="hidden md:block absolute top-8 left-8 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
      <div className="hidden md:block absolute top-20 right-20 w-24 h-24 bg-cyan-400/30 rounded-full blur-lg"></div>
      <div className="hidden md:block absolute bottom-20 left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>

      {/* Floating elements - hidden on mobile */}
      {/* \
      <div className="hidden md:block absolute top-20 left-20 w-30 h-24">
        <img src={bistey} alt="" className="w-full h-full object-contain"></img>
      </div>
      <div className="hidden md:block absolute top-1/9 right-40 w-40 h-40 text-cyan-300 transform rotate-0">
        <img src={sameer} alt="" className="w-full h-full object-contain"></img>
      </div>
      <div className="hidden md:block absolute bottom-70 right-50">
        <img src={srijan} className="h-50 w-50 object-contain"></img>
      </div>
      <div className="hidden md:block absolute bottom-16 right-20">
        <img src={sujal2} className="h-30 w-30 object-contain"></img>
      </div> */}

      {/* Main signup container */}
      <div className="flex items-center justify-center min-h-[100vh] p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 w-full max-w-md md:w-[35%] border border-white/20 shadow-2xl">
          {/* Logo/Avatar */}
          <div className="flex justify-center mb-6">
            <img
              src={billo}
              alt="Billo Logo"
              className="w-20 h-16 md:w-24 md:h-20 rounded-2xl"
            ></img>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-white text-2xl md:text-3xl font-semibold mb-2">
              Join Billo chat
            </h1>
            <p className="text-white/70 text-xs md:text-sm">
              Create your account to get started
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 md:py-3 bg-white/90 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm md:text-base"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 md:py-3 bg-white/90 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm md:text-base"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 md:py-3 bg-white/90 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm md:text-base"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 md:py-3 bg-white/90 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 pr-12 text-sm md:text-base"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 md:py-3 bg-white/90 rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 pr-12 text-sm md:text-base"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm md:text-base ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && (
                <svg
                  className="ml-2 w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 md:my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-2 bg-transparent text-white/60">
                  Or, sign up with
                </span>
              </div>
            </div>
          </div>

          {/* Social signup buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4 md:mb-6">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center py-2 md:py-3 px-4 bg-white/90 rounded-lg hover:bg-white transition-colors"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center py-2 md:py-3 px-4 bg-white/90 rounded-lg hover:bg-white transition-colors"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          {/* Login link */}
          <div className="text-center">
            <span className="text-white/60 text-xs md:text-sm">
              Already have an account?{" "}
            </span>
            <Link
              to="/"
              className="text-white text-xs md:text-sm hover:underline"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
