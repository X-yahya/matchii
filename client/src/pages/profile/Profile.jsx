import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";
import getCurrentUser from "../../utils/getCurrentUser";
import { FiCamera, FiUser, FiMail, FiGlobe, FiPhone, FiRefreshCw } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(() => ({
    name: "",
    username: "",
    email: "",
    description: "",
    country: "",
    phone: "",
    image: "",
    isSeller: false,
  }));
  
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

        if (!res?.data) {
          throw new Error('Invalid API response structure');
        }

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
          setStatus({ type: null, message: "" });
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
        name: user.name,
        username: user.username,
        email: user.email,
        description: user.description,
        country: user.country,
        phone: user.phone,
        image: imageUrl || "/default-avatar.png",
        isSeller: user.isSeller
      };
  
      const res = await newRequest.put(`/users/${currentUser._id}`, updateData);
  
      // Update local storage with new data
      const updatedUser = {
        ...currentUser,
        ...res.data.user,
        image: res.data.user.image || "/default-avatar.png"
      };
  
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Force state refresh in other components
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
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      {isLoading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <FiUser className="text-blue-500" />
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  src={imgPreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-sm"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <FiCamera className="text-white text-lg" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                About Me
              </label>
              <textarea
                name="description"
                value={user.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <RoleButton
                  label="Client"
                  checked={!user.isSeller}
                  onChange={() => setUser(p => ({ ...p, isSeller: false }))}
                />
                <RoleButton
                  label="Seller"
                  checked={user.isSeller}
                  onChange={() => setUser(p => ({ ...p, isSeller: true }))}
                />
              </div>
              <p className="text-sm text-gray-500">
                As a {user.isSeller ? "seller" : "client"}, you can{" "}
                {user.isSeller ? "offer your services" : "find professional services"}.
              </p>
            </div>

            {status.type === "error" && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                {status.message}
                <button 
                  onClick={() => window.location.reload()}
                  className="ml-4 underline hover:opacity-80"
                >
                  Retry
                </button>
              </div>
            )}

            {status.type === "success" && (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg">
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

const InputField = ({ label, name, value, onChange, Icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {Icon && <Icon className="inline mr-2 text-gray-400" />}
      {label}
    </label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      {...props}
    />
  </div>
);

const RoleButton = ({ label, checked, onChange }) => (
  <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
    checked 
      ? "border-blue-500 bg-blue-50" 
      : "border-gray-200 hover:border-gray-300"
  }`}>
    <input
      type="radio"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <span className="block text-center font-medium text-gray-700">{label}</span>
  </label>
);

export default Profile;