const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { sendOtpEmail , sendPasswordResetEmail } = require("../utils/email"); 


const generateUsername = (fullName) => {
  const baseUsername = fullName.toLowerCase().replace(/\s+/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); 
  return `${baseUsername}${randomSuffix}`;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, isSeller } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      username: generateUsername(name),
      email,
      password: hashedPassword,
      isSeller,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, 
    });

    

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
    const { email, password } = req.body; // Changed from name to email
    const user = await User.findOne({ email }); // Search by email instead of name

    if (!user) return next(createError(404, "User not found!"));
    
    if (!user.verified) {
      return next(createError(401, "Please verify your email before logging in"));
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return next(createError(401, "Incorrect password!")); // Updated error message
    
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );
    
    const { password: userPassword, ...safeUser } = user.toObject();
    res.cookie("accessTOKEN", token, { httpOnly: true }).status(200).send(safeUser);
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

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(createError(404, "No account found with this email"));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendPasswordResetEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email: { $regex: new RegExp(email, 'i') },
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) return next(createError(400, "Invalid or expired OTP"));

    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' },
      process.env.JWT_KEY,
      { expiresIn: '10m' }
    );

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ resetToken });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    

    const decoded = jwt.verify(resetToken, process.env.JWT_KEY);
    if (decoded.purpose !== 'password_reset') {
      return next(createError(401, "Invalid token"));
    }

    const user = await User.findById(decoded.id);
    if (!user) return next(createError(404, "User not found"));


    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, "Reset token expired"));
    }
    next(err);
  }
};

module.exports = { register, verifyOtp , verifyOtp, login, logout , forgotPassword, verifyResetOtp, resetPassword };

