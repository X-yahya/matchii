const createError = require("../utils/createError");

User = require("../models/user.model") ; 
jwt = require("jsonwebtoken") ; 


const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    const token = req.cookies.accessTOKEN;
    if (!token) {
        return createError(403,"You are not authenticated");
    }
        if (req.userId !== user._id.toString()) {
            return createError(403 ,"you can only delete your account");
        }

        await User.findByIdAndDelete(req.params.id);
        return res.status(200).send("User deleted successfully.");
};


const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

const uploadUserImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.image = image; // Save the Cloudinary URL
    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully", image: user.image });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile picture" });
  }
};

module.exports = { deleteUser, getUser, uploadUserImage };