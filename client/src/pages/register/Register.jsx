import React, { useState } from "react";
import Select from "react-select";
import countryFlagEmoji from "country-flag-icons/emojione";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    phone: "",
    img: "",
    desc: "",
    isSeller: false,
  });

  const countryOptions = [
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    // Add more countries as needed
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "checkbox" 
        ? e.target.checked 
        : e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 font-sf">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Join Freelance
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
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
              value={formData.email}
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
                value={formData.password}
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

          {/* Country Field with React Select */}
          <div>
            <label className="block text-gray-700 mb-2">Country</label>
            <Select
              options={countryOptions}
              value={countryOptions.find(opt => opt.value === formData.country)}
              onChange={(selected) => setFormData({...formData, country: selected.value})}
              formatOptionLabel={({ value, label }) => (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{countryFlagEmoji[value]}</span>
                  {label}
                </div>
              )}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#3b82f6'
                  }
                }),
                option: (base) => ({
                  ...base,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                })
              }}
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter phone number"
              pattern="\+?[0-9\s\-]+"
              required
            />
          </div>

          {/* Profile Image Field */}
          <div>
            <label className="block text-gray-700 mb-2">Profile Image URL</label>
            <input
              type="url"
              name="img"
              value={formData.img}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter image URL"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
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
              checked={formData.isSeller}
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
              id="terms"
              required
              className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
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