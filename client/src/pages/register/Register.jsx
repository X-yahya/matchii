import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";

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
  const [success, setSuccess] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 font-sf">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Join Freelance
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center">
            <FiAlertCircle className="text-green-500 mr-2" />
            <span className="text-green-600">
              Registration successful! Please check your email to verify your account.
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-600">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-800 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 pr-12"
                placeholder="Enter password"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-blue-500 transition"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Seller Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isSeller"
              checked={user.isSeller}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              id="isSeller"
            />
            <label htmlFor="isSeller" className="ml-2 text-gray-700">
              Register as a seller
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-500 text-white px-6 py-3 rounded-lg transition 
              ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-md'}`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-600">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

