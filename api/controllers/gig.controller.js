const createError = require("../utils/createError"); ;
const Gig = require("../models/gig.model"); ;
const User = require("../models/user.model");


const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

 const deleteGig = async (req , res , next) =>
{
  try{
    const gig = await Gig.findById(req.params.id) ;
    if(!gig) return next(createError(404 , "Gig not found")) ; 
    if(gig.userId !== req.userId) return next(createError(403 , "You can only delete your own gigs")) ; 
    await Gig.findByIdAndDelete(req.params.id) ; 
    res.status(200).json("Gig has been deleted") ;
  }catch(err)
  {
    console.log(err) ; 
    next(err); 
  }

}

const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('userId', 'username img level');
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    res.status(200).json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gig', error: err.message });
  }
};

const getGigs = async (req, res, next) => {
  try {
    const q = req.query;

    // Validate rating parameter
    if (q.rating && (isNaN(q.rating) || q.rating < 1 || q.rating > 5)) {
      return next(createError(400, "Rating must be between 1 and 5"));
    }

    const filters = {
      ...(q.userId && { userId: q.userId }),
      ...(q.category && { category: q.category }),
      ...(q.min && { "plans.price": { $gte: Number(q.min) } }),
      ...(q.max && { "plans.price": { $lte: Number(q.max) } }),
      ...(q.rating && { 
        $expr: {
          $and: [
            { $gt: ["$starNumber", 0] },
            {
              $gte: [
                { $divide: ["$totalStars", "$starNumber"] },
                Number(q.rating)
              ]
            }
          ]
        }
      }),
      ...(q.search && {
        $or: [
          { title: { $regex: q.search, $options: "i" } },
          { description: { $regex: q.search, $options: "i" } }
        ]
      }),
      status: "active", // Only fetch active gigs for clients
    };

    const sortOptions = {};
    if (q.sort) {
      sortOptions[q.sort] = -1;
    }

    const gigs = await Gig.find(filters)
      .sort(sortOptions)
      .populate('userId', 'username img level');
      
    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
};


const getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ userId: req.userId })
      .populate({
        path: 'userId',
        select: 'name image isSeller', // Ensure these match your User model
        model: 'User' // Explicitly reference the model
      })
      .lean(); // Convert to plain JS objects

    console.log('Fetched gigs:', JSON.stringify(gigs, null, 2)); // Debug logging
    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
};

const updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId.toString() !== req.userId.toString()) {
      return next(createError(403, "You can only update your own gigs"));
    }

    // Only allow updating specific fields
    const allowedUpdates = [
      'title', 'category', 'description', 'coverImage', 
      'gallery', 'plans'
    ];
    
    // Create update object
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};
const toggleGigStatus = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId.toString() !== req.userId.toString()) {
      return next(createError(403, "You can only update your own gigs"));
    }

    // Toggle the status
    const newStatus = gig.status === 'active' ? 'inactive' : 'active';
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { $set: { status: newStatus } },
      { new: true }
    );

    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};


// const enhanceGig = async (req, res, next) => {
//   if (!process.env.DEEPSEEK_API_KEY) {
//     console.error("FATAL: DeepSeek API key missing");
//     return next(createError(503, "AI enhancement service unavailable"));
//   }

//   try {
//     const gig = await Gig.findById(req.params.id);
//     if (!gig) return next(createError(404, "Gig not found"));
//     if (gig.userId.toString() !== req.userId.toString()) {
//       return next(createError(403, "You can only enhance your own gigs"));
//     }

//     // Construct the prompt
//     const prompt = `
//     You are a freelance marketplace expert. Enhance this gig offering:

//     Title: ${gig.title}
//     Category: ${gig.category}
//     Current Description: ${gig.description}
//     Current Plans:
//     ${gig.plans.map(plan => `
//       - ${plan.name}: ${plan.price} DT
//       Delivery: ${plan.deliveryDays} days
//       Revisions: ${plan.revisions || 'Unlimited'}
//       Features: ${plan.features.join(', ')}
//     `).join('\n')}

//     Suggestions needed:
//     1. Improve description to be more compelling and SEO-friendly
//     2. Suggest better pricing strategy with competitive prices (in Tunisian Dinar)
//     3. Optimize delivery times and revision counts
//     4. Add missing features that customers expect
//     5. Keep enhancements practical and market-appropriate
//     6. Maintain the same number of plans
//     7. Output must be valid JSON only

//     Respond in this EXACT JSON format ONLY:
//     {
//       "description": "enhanced description text",
//       "plans": [
//         {
//           "name": "enhanced plan name",
//           "price": 99.99,
//           "deliveryDays": 5,
//           "revisions": 3,
//           "features": ["feat1", "feat2", ...]
//         },
//         ... (same number of plans)
//       ]
//     }
//   `;

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout

//     try {
//       const response = await axios.post(
//         DEEPSEEK_API_URL,
//         {
//           model: "deepseek-chat",
//           messages: [{ role: "user", content: prompt }],
//           temperature: 0.7,
//           max_tokens: 2000,
//           response_format: { type: "json_object" }
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//             'Content-Type': 'application/json'
//           },
//           signal: controller.signal,
//           timeout: 40000
//         }
//       );

//       clearTimeout(timeout);

//       const content = response.data.choices[0].message.content;
//       let jsonString = content.trim();

//       // Handle JSON formatting
//       if (jsonString.startsWith('```json')) {
//         jsonString = jsonString.slice(7, -3).trim();
//       } else if (jsonString.startsWith('```')) {
//         jsonString = jsonString.slice(3, -3).trim();
//       }

//       // Parse and validate response
//       const enhancedData = JSON.parse(jsonString);
      
//       if (!enhancedData.description || !Array.isArray(enhancedData.plans)) {
//         return next(createError(500, "AI returned invalid response format"));
//       }

//       if (enhancedData.plans.length !== gig.plans.length) {
//         return next(createError(500, "AI changed number of plans"));
//       }

//       // Add default values for safety
//       const safePlans = enhancedData.plans.map(plan => ({
//         name: plan.name || "Untitled Plan",
//         price: Number(plan.price) || 0,
//         deliveryDays: Number(plan.deliveryDays) || 1,
//         revisions: Number(plan.revisions) || 1,
//         features: Array.isArray(plan.features) ? 
//                   plan.features.filter(f => f) : 
//                   ['Feature description']
//       }));

//       res.status(200).json({
//         description: enhancedData.description,
//         plans: safePlans
//       });

//     } catch (deepseekError) {
//       clearTimeout(timeout);
//       console.error("DeepSeek API error:", deepseekError);

//       let errorMessage = "AI enhancement failed";
//       let statusCode = 500;

//       if (deepseekError.response?.status === 401) {
//         errorMessage = "Invalid API key";
//         statusCode = 503;
//       } else if (deepseekError.code === 'ECONNABORTED' || deepseekError.name === 'AbortError') {
//         errorMessage = "AI enhancement timed out";
//       } else if (deepseekError instanceof SyntaxError) {
//         errorMessage = "AI returned invalid JSON format";
//       } else if (deepseekError.response?.data?.error?.message) {
//         errorMessage = `DeepSeek: ${deepseekError.response.data.error.message}`;
//       }

//       next(createError(statusCode, errorMessage));
//     }

//   } catch (err) {
//     console.error("Error in enhanceGig:", err);
//     next(createError(500, "Failed to enhance gig"));
//   }
// };



module.exports = { createGig, deleteGig, getGig, getGigs, getMyGigs, updateGig , toggleGigStatus  };