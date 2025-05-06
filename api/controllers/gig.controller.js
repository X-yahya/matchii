const createError = require("../utils/createError"); ;
const Gig = require("../models/Gig.model"); ;
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
  const q = req.query;

  // Build filters based on query parameters
  const filters = {
    ...(q.userId && { userId: q.userId }), 
    ...(q.category && { cat: q.cat }), 
    ...(q.min && { "plans.price": { $gte: Number(q.min) } }), 
    ...(q.max && { "plans.price": { $lte: Number(q.max) } }), 
    ...(q.search && {
      title: { $regex: q.search, $options: "i" }, 
    }),
  };

  console.log("Filters applied:", filters);
  console.log("Querying gigs for userId:", q.userId);

  try {
    // Fetch gigs based on filters
    const gigs = await Gig.find(filters);
    res.status(200).send(gigs);
  } catch (err) {
    console.error(err);
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

module.exports = { createGig, deleteGig, getGig, getGigs, getMyGigs };