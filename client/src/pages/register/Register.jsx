import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiEye, FiEyeOff, FiBriefcase, FiUser } from "react-icons/fi";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    isSeller: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await newRequest.post("auth/register", user);
      navigate("/verify-otp", { state: { email: user.email } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleRole = (isSeller) => {
    setUser(prev => ({ ...prev, isSeller }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-sm border border-gray-100 p-8 font-sans">
        <div className="mb-10 text-center">
          <h2 className="text-[28px] font-semibold text-gray-900 mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-500 text-[15px]">
            Join our community of freelancers and clients
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="flex-shrink-0 text-red-500 h-5 w-5" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Join as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => toggleRole(false)}
                onKeyDown={(e) => e.key === 'Enter' && toggleRole(false)}
                role="button"
                tabIndex={0}
                className={`p-4 border rounded-lg cursor-pointer transition-all
                  ${!user.isSeller 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-gray-200 hover:border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <FiUser className="w-6 h-6 mb-2 text-gray-700" />
                <h3 className="font-medium text-gray-900 mb-1">Client</h3>
                <p className="text-sm text-gray-500">Hire skilled professionals</p>
              </div>
              
              <div
                onClick={() => toggleRole(true)}
                onKeyDown={(e) => e.key === 'Enter' && toggleRole(true)}
                role="button"
                tabIndex={0}
                className={`p-4 border rounded-lg cursor-pointer transition-all
                  ${user.isSeller 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-gray-200 hover:border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <FiBriefcase className="w-6 h-6 mb-2 text-gray-700" />
                <h3 className="font-medium text-gray-900 mb-1">Seller</h3>
                <p className="text-sm text-gray-500">Offer your services</p>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                placeholder:text-gray-400 transition duration-200"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full h-11 px-4 border border-gray-300 rounded-lg 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                placeholder:text-gray-400 transition duration-200"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-lg 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                  placeholder:text-gray-400 transition duration-200 pr-12"
                placeholder="••••••••"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                  hover:text-gray-500 p-1.5 rounded-full hover:bg-gray-50 transition"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-11 bg-blue-500 text-white px-6 rounded-lg transition-all
              ${isSubmitting 
                ? "opacity-80 cursor-not-allowed" 
                : "hover:bg-blue-600 active:bg-blue-700 active:scale-[0.98]"
              }`}
          >
            {isSubmitting ? "Creating Account..." : "Continue"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 pt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:text-blue-600 font-medium underline underline-offset-3"
            >
              Sign in now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;