import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest'; // Assuming this is your axios instance
import upload from '../../utils/upload'; // Assuming this is your image upload utility
import { FaMagic } from 'react-icons/fa'; // For the AI Enhance icon




const EditGig = () => {
  // Get gig ID from URL parameters
  const { id } = useParams();
  // Get current user from local storage (assuming it's stored there)
  const [currentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
  // React Router hook for navigation
  const navigate = useNavigate();
  // React Query client for cache invalidation
  const queryClient = useQueryClient();

  // State for managing UI feedback during operations
  const [uploading, setUploading] = useState(false); // For image uploads
  const [enhancing, setEnhancing] = useState(false); // For AI enhancement
  const [enhancementError, setEnhancementError] = useState(null); // For AI enhancement errors

  // Fetch gig data using React Query
  const { isLoading, error, data } = useQuery({
    queryKey: ['gig', id], // Unique key for this query
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data), // API call to fetch gig
    enabled: !!id, // Only run query if ID is available
  });

  // Form data state, initialized with a basic plan structure
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    coverImage: '',
    gallery: [],
    plans: [{ name: '', price: 0, deliveryDays: 0, revisions: 1, features: [''] }],
  });

  // Effect to populate form data once gig data is loaded
  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        category: data.category || '',
        description: data.description || '',
        coverImage: data.coverImage || '',
        gallery: data.gallery || [],
        plans: data.plans && data.plans.length > 0
          ? data.plans.map(plan => ({
              ...plan,
              revisions: plan.revisions || 1, // Default revisions to 1 if not set
              features: plan.features && plan.features.length > 0
                ? plan.features
                : [''] // Ensure at least one empty feature input
            }))
          : [{ name: '', price: 0, deliveryDays: 0, revisions: 1, features: [''] }], // Default to one empty plan
      });
    }
  }, [data]); // Depend on 'data' so this runs when data changes

  // Handles changes for top-level form fields (title, category, description)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles changes for fields within a specific plan (name, price, deliveryDays, revisions)
  const handlePlanChange = (index, field, value) => {
    const newPlans = [...formData.plans];

    // Convert numeric fields to numbers
    if (['price', 'deliveryDays', 'revisions'].includes(field)) {
      value = Number(value);
    }

    newPlans[index][field] = value;
    setFormData({ ...formData, plans: newPlans });
  };

  // Handles changes for individual features within a plan
  const handleFeatureChange = (planIndex, featureIndex, value) => {
    const newPlans = [...formData.plans];
    newPlans[planIndex].features[featureIndex] = value;
    setFormData({ ...formData, plans: newPlans });
  };

  // Handles adding a new feature input field to a specific plan
  const addFeature = (planIndex) => {
    const newPlans = [...formData.plans];
    newPlans[planIndex].features.push(''); // Add an empty string for a new feature
    setFormData({ ...formData, plans: newPlans });
  };

  // Handles removing a feature input field from a specific plan
  const removeFeature = (planIndex, featureIndex) => {
    const newPlans = [...formData.plans];
    newPlans[planIndex].features.splice(featureIndex, 1); // Remove feature at index
    setFormData({ ...formData, plans: newPlans });
  };

  // Handles adding a new pricing plan
  const addPlan = () => {
    setFormData({
      ...formData,
      plans: [
        ...formData.plans,
        { name: '', price: 0, deliveryDays: 1, revisions: 1, features: [''] }, // New empty plan structure
      ],
    });
  };

  // Handles removing a pricing plan
  const removePlan = (planIndex) => {
    const newPlans = [...formData.plans];
    newPlans.splice(planIndex, 1); // Remove plan at index
    setFormData({ ...formData, plans: newPlans });
  };

  // Handles image file selection and upload
  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true); // Set uploading state to true
    try {
      const url = await upload(file); // Call the upload utility
      if (type === 'cover') {
        setFormData({ ...formData, coverImage: url });
      } else if (type === 'gallery') {
        setFormData({ ...formData, gallery: [...formData.gallery, url] });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      // Use a custom message box instead of alert() for better UX
      // For this example, I'll keep alert for simplicity, but a modal would be better
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  // Handles removing an already uploaded image (cover or gallery)
  const removeImage = (index, type) => {
    if (type === 'cover') {
      setFormData({ ...formData, coverImage: '' });
    } else if (type === 'gallery') {
      const newGallery = [...formData.gallery];
      newGallery.splice(index, 1);
      setFormData({ ...formData, gallery: newGallery });
    }
  };

  // React Query mutation for updating the gig
  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.put(`/gigs/${id}`, gig); // API call to update gig
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries(['gig', id]);
      queryClient.invalidateQueries(['myGigs']);
      navigate('/mygigs'); // Navigate back to my gigs page
    },
    onError: (error) => {
      // Display error message from API response or a generic one
      alert(error?.response?.data?.message || 'Failed to update gig.');
    }
  });




  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic client-side validation for required fields
    if (!formData.title || !formData.category || !formData.description || !formData.coverImage) {
      alert('Please fill all required fields');
      return;
    }

    // Clean up features array: remove empty feature strings before sending
    const cleanedPlans = formData.plans.map(plan => ({
      ...plan,
      features: plan.features.filter(feat => feat.trim() !== ''),
    }));

    // Trigger the mutation to update the gig
    mutation.mutate({
      ...formData,
      plans: cleanedPlans,
    });
  };

  // --- Loading and Error States ---
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 max-w-md mx-auto mt-8 text-center">
      <div className="text-red-500 font-medium mb-2">
        Error loading gig: {error.message}
      </div>
      <button
        onClick={() => navigate('/mygigs')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to My Gigs
      </button>
    </div>
  );

  // --- Main Component Render ---
  return (
    <div className="add p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        
        {/* <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Edit Gig</h1>
          <button
            onClick={handleEnhance}
            disabled={enhancing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md ${
              enhancing
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white font-semibold transition-colors shadow-md`}
          >
            <FaMagic className="text-lg" />
            {enhancing ? 'Enhancing...' : 'AI Enhance'}
          </button>
        </div> */}

        {enhancementError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm border border-red-200">
            {enhancementError}
          </div>
        )}

        <div className="sections grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Basic Gig Details */}
          <div className="left bg-white p-8 rounded-lg shadow-xl">
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
                Gig Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. I will design a stunning logo for your brand"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select Category</option>
                <option value="graphics">Graphics & Design</option>
                <option value="programming">Programming & Tech</option>
                <option value="digital">Digital Marketing</option>
                <option value="video">Video & Animation</option>
                <option value="writing">Writing & Translation</option>
                <option value="music">Music & Audio</option>
                <option value="business">Business</option>
                <option value="data">Data</option>
                <option value="photography">Photography</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Cover Image <span className="text-red-500">*</span>
              </label>
              {formData.coverImage ? (
                <div className="mb-4 relative group">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-56 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(0, 'cover')}
                    className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Remove cover image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 mb-4">
                  No cover image selected.
                </div>
              )}
              <input
                type="file"
                onChange={(e) => handleImageChange(e, 'cover')}
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                disabled={uploading}
              />
              {uploading && <p className="text-blue-500 mt-2 text-sm">Uploading image...</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Gallery Images
              </label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.gallery.map((img, index) => (
                  <div className="relative group" key={index}>
                    <img
                      src={img}
                      alt={`Gallery ${index}`}
                      className="w-full h-28 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, 'gallery')}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Remove gallery image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                onChange={(e) => handleImageChange(e, 'gallery')}
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                disabled={uploading}
                multiple // Allow multiple file selection for gallery
              />
              {uploading && <p className="text-blue-500 mt-2 text-sm">Uploading image...</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Brief descriptions to introduce your service to customers"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              disabled={mutation.isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                mutation.isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors shadow-lg`}
            >
              {mutation.isLoading ? 'Updating...' : 'Update Gig'}
            </button>
            {mutation.error && (
              <p className="text-red-500 mt-3 text-sm text-center">
                Error: {mutation.error.response?.data?.message || mutation.error.message}
              </p>
            )}
          </div>

          {/* Right Section: Pricing Plans */}
          <div className="right bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing Plans</h2>

            {formData.plans.map((plan, planIndex) => (
              <div className="plan mb-8 border border-gray-200 rounded-lg p-5 shadow-sm" key={planIndex}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-700">Plan #{planIndex + 1}</h3>
                  {formData.plans.length > 1 && (
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                      onClick={() => removePlan(planIndex)}
                    >
                      Remove Plan
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1.5 text-sm">Plan Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Basic package"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1.5 text-sm">Price (DT)</label>
                    <input
                      type="number"
                      placeholder="Price"
                      min="0"
                      value={plan.price}
                      onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1.5 text-sm">Delivery Days</label>
                    <input
                      type="number"
                      placeholder="Delivery Days"
                      min="1"
                      value={plan.deliveryDays}
                      onChange={(e) => handlePlanChange(planIndex, 'deliveryDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1.5 text-sm">Number of Revisions</label>
                  <input
                    type="number"
                    placeholder="Revisions"
                    min="0"
                    value={plan.revisions}
                    onChange={(e) => handlePlanChange(planIndex, 'revisions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1.5 text-sm">Features</label>
                  {plan.features.map((feature, featureIndex) => (
                    <div className="flex items-center mb-2" key={featureIndex}>
                      <input
                        type="text"
                        placeholder="Feature description"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(planIndex, featureIndex, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-2 rounded-r-md hover:bg-red-600 transition-colors"
                        onClick={() => removeFeature(planIndex, featureIndex)}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors"
                    onClick={() => addFeature(planIndex)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Feature
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="w-full py-2.5 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center font-semibold transition-colors shadow-md"
              onClick={addPlan}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGig;