import { User } from "../model/user.model.js";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

/**
 * GET /api/users/me
 * Get logged-in user's profile
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/users/me
 * Update logged-in user's profile
 */
export const updateMyProfile = async (req, res) => {
  try {
    const { name, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update text fields
    if (name) user.name = name;
    if (address) user.address = address;

    // Update image ONLY via file upload
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const result = await cloudinary.uploader.upload(fileUri.content);
      user.image = result.secure_url;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        image: user.image,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
