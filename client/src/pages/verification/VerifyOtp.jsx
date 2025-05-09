import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await newRequest.post("/auth/verify-otp", {
      email: location.state.email.toLowerCase(), // Ensure lowercase
      otp
    });

    if (res.status === 200) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  } catch (err) {
    setError(err.response?.data?.message || "Invalid OTP");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Verify Your Email
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg text-green-600">
            Email verified successfully! Redirecting to login...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the OTP sent to your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    console.log("Verifying OTP for email:", email);
    console.log("Received OTP:", otp);

    // Find the user by email and OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }, // Ensure the OTP is not expired
    });

    if (!user) {
      console.log("Invalid or expired OTP for email:", email);
      return next(createError(400, "Invalid or expired OTP"));
    }

    // Mark the user as verified
    user.verified = true;
    user.otp = undefined; // Clear the OTP
    user.otpExpires = undefined;
    await user.save();

    console.log("User verified successfully:", email);

    res.status(200).send("Email verified successfully!");
  } catch (err) {
    console.error("OTP verification error:", err);
    next(err);
  }
};