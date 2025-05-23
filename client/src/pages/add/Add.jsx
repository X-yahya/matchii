import { useState } from 'react';
import newRequest from '../../utils/newRequest';
import { useNavigate } from 'react-router-dom';
import {categories} from '../../data';
export default function Add() {
  const [gigData, setGigData] = useState({
    title: '',
    category: '',
    description: '',
    plans: [{ name: 'Basic', price: '', deliveryDays: '', features: [''] }],
    faq: [{ question: '', answer: '' }],
    coverImage: null,
    gallery: []
  });
  const navigate = useNavigate();

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      const updatedSection = gigData[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      );
      setGigData({ ...gigData, [section]: updatedSection });
    } else {
      setGigData({ ...gigData, [section]: value });
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'marketplace');

    try {
      const response = await newRequest.post('https://api.cloudinary.com/v1_1/dddntqfyo/image/upload', formData, {
        withCredentials: false, // Ensure credentials are not sent
      });
      return response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload cover image to Cloudinary
      const coverImageUrl = gigData.coverImage ? await handleImageUpload(gigData.coverImage) : null;

      
      const galleryUrls = await Promise.all(
        gigData.gallery.map((file) => handleImageUpload(file))
      );

      // Ensure coverImage is provided
      if (!coverImageUrl) {
        alert("Cover image is required.");
        return;
      }

      // Prepare payload
      const payload = {
        ...gigData,
        coverImage: coverImageUrl,
        gallery: galleryUrls,
      };

      // Send gig data to the backend
      const response = await newRequest.post('/gigs', payload);
      console.log('Gig created successfully:', response.data);
      navigate('/mygigs');
    } catch (error) {
      console.error('Failed to create gig:', error);
      alert('Failed to create gig. Please try again.');
    }
  };

  const handleImagePreview = (file) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gig Title</label>
              <input
                type="text"
                value={gigData.title}
                onChange={(e) => setGigData({ ...gigData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={gigData.category}
                onChange={(e) => setGigData({ ...gigData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={gigData.description}
                onChange={(e) => setGigData({ ...gigData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing Plans Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing Plans</h2>
          <div className="space-y-6">
            {gigData.plans.map((plan, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Plan {index + 1}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handleInputChange('plans', 'name', e.target.value, index)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handleInputChange('plans', 'price', e.target.value, index)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time (Days)</label>
                    <input
                      type="number"
                      value={plan.deliveryDays}
                      onChange={(e) => handleInputChange('plans', 'deliveryDays', e.target.value, index)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const updatedPlans = [...gigData.plans];
                          updatedPlans[index].features[fIndex] = e.target.value;
                          setGigData({ ...gigData, plans: updatedPlans });
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedPlans = [...gigData.plans];
                      updatedPlans[index].features.push('');
                      setGigData({ ...gigData, plans: updatedPlans });
                    }}
                    className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setGigData({
                  ...gigData,
                  plans: [...gigData.plans, { name: '', price: '', deliveryDays: '', features: [''] }]
                });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-600 hover:border-gray-400"
            >
              + Add New Plan
            </button>
          </div>
        </div>

        {/* Media Upload Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setGigData({ ...gigData, coverImage: file });
                  }}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload" className="cursor-pointer">
                  <p className="text-gray-600">Drag and drop or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x800px</p>
                </label>
                {gigData.coverImage && (
                  <img
                    src={handleImagePreview(gigData.coverImage)}
                    alt="Cover Preview"
                    className="mt-4 w-full h-auto rounded-lg"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setGigData({ ...gigData, gallery: [...gigData.gallery, ...files] });
                  }}
                  className="hidden"
                  id="gallery-upload"
                />
                <label htmlFor="gallery-upload" className="cursor-pointer">
                  <p className="text-gray-600">Drag and drop or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">Up to 5 images</p>
                </label>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {gigData.gallery.map((file, index) => (
                    <img
                      key={index}
                      src={handleImagePreview(file)}
                      alt={`Gallery Preview ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">FAQ</h2>
          <div className="space-y-4">
            {gigData.faq.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleInputChange('faq', 'question', e.target.value, index)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleInputChange('faq', 'answer', e.target.value, index)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 h-24"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setGigData({
                  ...gigData,
                  faq: [...gigData.faq, { question: '', answer: '' }]
                });
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-600 hover:border-gray-400"
            >
              + Add FAQ
            </button>
          </div>
        </div>

        {/* Submission Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Publish Gig
          </button>
        </div>
      </form>
    </div>
  );
}