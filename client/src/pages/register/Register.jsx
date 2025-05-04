import React, { useState } from "react";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    name: "", // Added name field
    username: "",
    email: "",
    password: "",
    country: "",
    phone: "",
    img: file,
    desc: "",
    isSeller: false,
    acceptedTerms: false,
  });
  const [imgPreview, setImgPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting user data:", user);

    try {
      const url = await upload(file);
      const userData = { ...user, img: url };
      console.log("Final payload:", userData);

      await newRequest.post("auth/register", userData);
      console.log("Registration successful");
      navigate("/login")
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUser((prev) => ({ ...prev, img: file }));
      setFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 font-sf">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Join Freelance
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Field */}
          <div>
            <label className="block text-gray-700 mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {imgPreview ? (
                  <img
                    src={imgPreview}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  name="img"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="profileImage"
                  required
                />
              </div>
              <label
                htmlFor="profileImage"
                className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                Choose Image
              </label>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter username"
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
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
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
                className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
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
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Country Field */}
          <div>
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={user.country}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your country"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter phone number"
              pattern="\+?[0-9\s\-]+"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="desc"
              value={user.desc}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Tell us about yourself..."
              rows="4"
              required
            ></textarea>
          </div>

          {/* Seller Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isSeller"
              checked={user.isSeller}
              onChange={handleChange}
              className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
              id="sellerCheckbox"
            />
            <label htmlFor="sellerCheckbox" className="text-gray-700">
              I want to become a seller
            </label>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={user.acceptedTerms}
              onChange={handleChange}
              className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
              id="terms"
              required
            />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 
              rounded-full transition hover:scale-105 duration-300 font-medium"
          >
            Create Account
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