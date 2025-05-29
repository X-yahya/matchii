import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";
import getCurrentUser from "../../utils/getCurrentUser";
import { FiCamera, FiUser, FiMail, FiGlobe, FiPhone, FiRefreshCw, FiBriefcase, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    description: "",
    country: "",
    phone: "",
    image: "",
    isSeller: false,
  });
  
  const [file, setFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("/default-avatar.png");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        setStatus({ type: null, message: "" });

        const currentUser = getCurrentUser();
        const res = await newRequest.get(`/users/${currentUser._id}`, {
          signal: controller.signal,
        });

        if (!isMounted) return;

        const sanitizedData = {
          name: res.data.name || "",
          username: res.data.username || "",
          email: res.data.email || "",
          description: res.data.description || "",
          country: res.data.country || "",
          phone: res.data.phone || "",
          image: res.data.image || "/default-avatar.png",
          isSeller: res.data.isSeller || false,
        };

        if (isMounted) {
          setUser(sanitizedData);
          setImgPreview(sanitizedData.image);
        }

      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          setStatus({ 
            type: "error", 
            message: err.response?.data?.message || "Failed to load profile data" 
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Please upload an image file" });
      return;
    }

    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result || "/default-avatar.png");
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    } catch (err) {
      setStatus({ type: "error", message: "Failed to process image" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });
  
    try {
      const currentUser = getCurrentUser();
      let imageUrl = user.image;
      
      if (file) {
        imageUrl = await upload(file);
      }
  
      const updateData = {
        ...user,
        image: imageUrl || "/default-avatar.png"
      };
  
      const res = await newRequest.put(`/users/${currentUser._id}`, updateData);
  
      const updatedUser = {
        ...currentUser,
        ...res.data.user,
        image: res.data.user.image || "/default-avatar.png"
      };
  
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));
  
      setStatus({ type: "success", message: "Profile updated successfully!" });
      setTimeout(() => setStatus({ type: null, message: "" }), 3000);
  
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-sans">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <FiRefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-600 text-[15px]">Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <h1 className="text-[28px] font-semibold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-500 text-[15px]">Manage your account details and preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  src={imgPreview}
                  alt="Profile Preview"
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-50 shadow-sm hover:border-gray-100 transition-colors"
                />
                <label className="absolute bottom-4 right-4 bg-blue-500 p-3 rounded-full cursor-pointer hover:bg-blue-600 transition-all shadow-lg">
                  <FiCamera className="text-white text-xl" />
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
              {isLoading && <p className="text-sm text-gray-500">Processing image...</p>}
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Full Name"
                name="name"
                value={user.name}
                Icon={FiUser}
                disabled
              />
              <InputField
                label="Username"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
              />
              <InputField
                label="Email"
                name="email"
                value={user.email}
                Icon={FiMail}
                disabled
              />
              <InputField
                label="Country"
                name="country"
                value={user.country}
                onChange={handleChange}
                Icon={FiGlobe}
              />
              <InputField
                label="Phone Number"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                Icon={FiPhone}
              />
            </div>

            {/* Bio Textarea */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                About Me
              </label>
              <textarea
                name="description"
                value={user.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-200"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-5">
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <RoleCard
                  icon={FiUser}
                  title="Client"
                  description="Hire skilled professionals"
                  isActive={!user.isSeller}
                  onClick={() => setUser(p => ({ ...p, isSeller: false }))}
                />
                <RoleCard
                  icon={FiBriefcase}
                  title="Seller"
                  description="Offer your services"
                  isActive={user.isSeller}
                  onClick={() => setUser(p => ({ ...p, isSeller: true }))}
                />
              </div>
            </div>

            {/* Status Messages */}
            {status.type && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                status.type === "error" ? "bg-red-50" : "bg-green-50"
              }`}>
                {status.type === "error" ? (
                  <FiAlertCircle className="flex-shrink-0 text-red-500 w-5 h-5" />
                ) : (
                  <FiCheckCircle className="flex-shrink-0 text-green-500 w-5 h-5" />
                )}
                <span className={`text-sm ${status.type === "error" ? "text-red-600" : "text-green-600"}`}>
                  {status.message}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className={`w-full h-12 bg-blue-500 text-white rounded-xl transition-all
                ${isLoading || isSubmitting 
                  ? "opacity-80 cursor-not-allowed" 
                  : "hover:bg-blue-600 active:bg-blue-700 active:scale-[0.98]"
                }`}
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, name, value, onChange, Icon, disabled, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {Icon && <Icon className="inline mr-2 text-gray-400 w-5 h-5" />}
      {label}
    </label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full h-11 px-4 border ${
        disabled ? "bg-gray-50 border-gray-200" : "border-gray-200"
      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-200`}
      {...props}
    />
  </div>
);

// Role Card Component
const RoleCard = ({ icon: Icon, title, description, isActive, onClick }) => (
  <div
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    role="button"
    tabIndex={0}
    className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
      isActive 
        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <Icon className="w-6 h-6 mb-3 text-gray-700" />
    <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

export default Profile;