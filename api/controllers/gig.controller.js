const createError = require("../utils/createError"); ;
const Gig = require("../models/gig.model"); ;
const User = require("../models/user.model");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
//const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
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



const enhanceGig = async (req, res, next) => {
  // Check for Gemini API Key
  if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL: Gemini API key missing");
    return next(createError(503, "AI enhancement service unavailable"));
  }

  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    if (gig.userId.toString() !== req.userId.toString()) {
      return next(createError(403, "You can only enhance your own gigs"));
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // You can choose a different model if needed, e.g., 'gemini-pro-1.5'
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Construct the prompt
    const prompt = `
You are a freelance marketplace expert, focused on optimizing gig offerings while respecting strict structural requirements.

Enhance this gig offering, **ENSURING YOU MAINTAIN THE EXACT SAME NUMBER OF PLANS** as provided in the "Current Plans" section. DO NOT add or remove any plan entries.

Title: ${gig.title}
Category: ${gig.category}
Current Description: ${gig.description}
Current Plans:
${gig.plans
  .map(
    (plan) => `
      - ${plan.name}: ${plan.price} DT
      Delivery: ${plan.deliveryDays} days
      Revisions: ${plan.revisions || "Unlimited"}
      Features: ${plan.features.join(", ")}
    `
  )
  .join("\n")}

Suggestions needed:
1. Improve description to be more compelling and SEO-friendly
2. Suggest better pricing strategy with competitive prices (in Tunisian Dinar)
3. Optimize delivery times and revision counts
4. Add missing features that customers expect
5. Keep enhancements practical and market-appropriate
**6. MAINTAIN THE SAME NUMBER OF PLANS. DO NOT add or remove plans.**
7. Output must be valid JSON only

Respond in this EXACT JSON format ONLY:
{
  "description": "enhanced description text",
  "plans": [
    {
      "name": "enhanced plan name",
      "price": 99.99,
      "deliveryDays": 5,
      "revisions": 3,
      "features": ["feat1", "feat2", "..."]
    },
    ... (same number of plans)
  ]
}
`;

    try {
      // Generate content with Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text(); // Get the text content from the Gemini response

      let jsonString = content.trim();

      // Gemini often wraps JSON in triple backticks, so we'll handle that
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString.slice(7, -3).trim();
      } else if (jsonString.startsWith("```")) {
        // Just in case it's ``` without 'json'
        jsonString = jsonString.slice(3, -3).trim();
      }

      // Parse and validate response
      const enhancedData = JSON.parse(jsonString);

      if (!enhancedData.description || !Array.isArray(enhancedData.plans)) {
        return next(createError(500, "AI returned invalid response format"));
      }

      if (enhancedData.plans.length !== gig.plans.length) {
        return next(createError(500, "AI changed number of plans"));
      }

      // Add default values for safety
      const safePlans = enhancedData.plans.map((plan) => ({
        name: plan.name || "Untitled Plan",
        price: Number(plan.price) || 0,
        deliveryDays: Number(plan.deliveryDays) || 1,
        revisions: Number(plan.revisions) || 1,
        features: Array.isArray(plan.features)
          ? plan.features.filter((f) => f)
          : ["Feature description"],
      }));

      res.status(200).json({
        description: enhancedData.description,
        plans: safePlans,
      });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);

      let errorMessage = "AI enhancement failed";
      let statusCode = 500;

      // Check for common Gemini API errors (e.g., authentication, rate limits)
      if (geminiError.message && geminiError.message.includes("API key not valid")) {
        errorMessage = "Invalid Gemini API key";
        statusCode = 503;
      } else if (geminiError.message && geminiError.message.includes("timeout")) {
        errorMessage = "AI enhancement timed out";
      } else if (geminiError instanceof SyntaxError) {
        errorMessage = "AI returned invalid JSON format";
      } else if (
        geminiError.message &&
        geminiError.message.includes("quota")
      ) {
        errorMessage = "Gemini API rate limit exceeded";
        statusCode = 429;
      }

      next(createError(statusCode, errorMessage));
    }
  } catch (err) {
    console.error("Error in enhanceGig:", err);
    next(createError(500, "Failed to enhance gig"));
  }
};



module.exports = { createGig, deleteGig, getGig, getGigs, getMyGigs, updateGig , toggleGigStatus , enhanceGig };