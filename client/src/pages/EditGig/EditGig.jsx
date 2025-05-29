import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import upload from '../../utils/upload';


const EditGig = () => {
  const { id } = useParams();
  const [currentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // Fetch gig data
  const { isLoading, error, data } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  // Initialize state with gig data
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    coverImage: '',
    gallery: [],
    plans: [{ name: '', price: 0, deliveryDays: 0, revisions: 1, features: [''] }],
  });

  // Set form data when gig is loaded
  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title,
        category: data.category,
        description: data.description,
        coverImage: data.coverImage,
        gallery: data.gallery || [],
        plans: data.plans.length > 0 
          ? data.plans.map(plan => ({
              ...plan,
              revisions: plan.revisions || 1,
              features: plan.features && plan.features.length > 0 
                ? plan.features 
                : ['']
            }))
          : [{ name: '', price: 0, deliveryDays: 0, revisions: 1, features: [''] }],
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...formData.plans];
    
    // Convert to number if it's a numeric field
    if (['price', 'deliveryDays', 'revisions'].includes(field)) {
      value = Number(value);
    }
    
    newPlans[index][field] = value;
    setFormData({ ...formData, plans: newPlans });
  };

  const handleFeatureChange = (planIndex, featureIndex, value) => {
    const newPlans = [...formData.plans];
    newPlans[planIndex].features[featureIndex] = value;
    setFormData({ ...formData, plans: newPlans });
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await upload(file);
      if (type === 'cover') {
        setFormData({ ...formData, coverImage: url });
      } else if (type === 'gallery') {
        setFormData({ ...formData, gallery: [...formData.gallery, url] });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index, type) => {
    if (type === 'cover') {
      setFormData({ ...formData, coverImage: '' });
    } else if (type === 'gallery') {
      const newGallery = [...formData.gallery];
      newGallery.splice(index, 1);
      setFormData({ ...formData, gallery: newGallery });
    }
  };

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.put(`/gigs/${id}`, gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gig', id]);
      queryClient.invalidateQueries(['myGigs']);
      navigate('/mygigs');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.category || !formData.description || !formData.coverImage) {
      alert('Please fill all required fields');
      return;
    }
    
    // Clean up features array
    const cleanedPlans = formData.plans.map(plan => ({
      ...plan,
      features: plan.features.filter(feat => feat.trim() !== ''),
    }));

    mutation.mutate({
      ...formData,
      plans: cleanedPlans,
    });
  };

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

  return (
    <div className="add">
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Edit Gig</h1>
        <div className="sections grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="left bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. I will do something I'm really good at"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Cover Image <span className="text-red-500">*</span>
              </label>
              {formData.coverImage ? (
                <div className="mb-3 relative">
                  <img 
                    src={formData.coverImage} 
                    alt="Cover preview" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(0, 'cover')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <p className="text-gray-500 mb-2">No cover image selected</p>
                </div>
              )}
              <input 
                type="file" 
                onChange={(e) => handleImageChange(e, 'cover')}
                className="w-full mt-1"
                disabled={uploading}
              />
              {uploading && <p className="text-blue-500 mt-1">Uploading image...</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Gallery Images
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {formData.gallery.map((img, index) => (
                  <div className="relative" key={index}>
                    <img 
                      src={img} 
                      alt={`Gallery ${index}`} 
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index, 'gallery')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
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
                className="w-full"
                disabled={uploading}
              />
              {uploading && <p className="text-blue-500 mt-1">Uploading image...</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Brief descriptions to introduce your service to customers"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={mutation.isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                mutation.isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {mutation.isLoading ? 'Updating...' : 'Update Gig'}
            </button>
            {mutation.error && (
              <p className="text-red-500 mt-2">
                Error: {mutation.error.response?.data?.message || mutation.error.message}
              </p>
            )}
          </div>
          
          <div className="right bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pricing Plans</h2>
            
            {formData.plans.map((plan, planIndex) => (
              <div className="plan mb-6 border border-gray-200 rounded-lg p-4" key={planIndex}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Plan #{planIndex + 1}</h3>
                  {formData.plans.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newPlans = [...formData.plans];
                        newPlans.splice(planIndex, 1);
                        setFormData({ ...formData, plans: newPlans });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Basic package"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-gray-700 mb-1">Price (DT)</label>
                    <input
                      type="number"
                      placeholder="Price"
                      min="0"
                      value={plan.price}
                      onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Delivery Days</label>
                    <input
                      type="number"
                      placeholder="Delivery Days"
                      min="1"
                      value={plan.deliveryDays}
                      onChange={(e) => handlePlanChange(planIndex, 'deliveryDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">Number of Revisions</label>
                  <input
                    type="number"
                    placeholder="Revisions"
                    min="0"
                    value={plan.revisions}
                    onChange={(e) => handlePlanChange(planIndex, 'revisions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">Features</label>
                  {plan.features.map((feature, featureIndex) => (
                    <div className="flex mb-2" key={featureIndex}>
                      <input
                        type="text"
                        placeholder="Feature description"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(planIndex, featureIndex, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        className="bg-red-500 text-white px-3 rounded-r-md hover:bg-red-600"
                        onClick={() => {
                          const newPlans = [...formData.plans];
                          newPlans[planIndex].features.splice(featureIndex, 1);
                          setFormData({ ...formData, plans: newPlans });
                        }}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-1 text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => {
                      const newPlans = [...formData.plans];
                      newPlans[planIndex].features.push('');
                      setFormData({ ...formData, plans: newPlans });
                    }}
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
              className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
              onClick={() => {
                setFormData({
                  ...formData,
                  plans: [
                    ...formData.plans,
                    {
                      name: '',
                      price: 0,
                      deliveryDays: 1,
                      revisions: 1,
                      features: [''],
                    },
                  ],
                });
              }}
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