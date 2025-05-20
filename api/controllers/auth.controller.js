const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { sendOtpEmail } = require("../utils/email"); // Use destructuring to import sendOtpEmail


const generateUsername = (fullName) => {
  const baseUsername = fullName.toLowerCase().replace(/\s+/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return `${baseUsername}${randomSuffix}`;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, isSeller } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "Email already exists"));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create the new user
    const newUser = new User({
      name,
      username: generateUsername(name),
      email,
      password: hashedPassword,
      isSeller,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
    });

    

    // Send OTP email
    await sendOtpEmail(email, otp);
    await newUser.save();

    res.status(201).send("User registered successfully. Please check your email for the OTP.");
  } catch (err) {
    console.error("Registration error:", err);
    next(err);
  }
};
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Case-insensitive email search
    const user = await User.findOne({
      email: { $regex: new RegExp(email, 'i') },
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log(`OTP verification failed for ${email}`);
      return next(createError(400, "Invalid or expired OTP"));
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("OTP verification error:", err);
    next(createError(500, "Verification failed"));
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) return next(createError(404, "User not found!"));
    
    if (!user.verified) {
      return next(createError(401, "Please verify your email before logging in"));
    }

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(404, "wrong password or username!"));
    
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );
    
    const { password, ...info } = user;
    res.cookie("accessTOKEN", token, { httpOnly: true }).status(200).send(user);
  } catch (err) {
    next(err);
  }
}; 

const logout = async (req, res) => {
  res
    .clearCookie("accessTOKEN", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

module.exports = { register, verifyOtp , verifyOtp, login, logout };

