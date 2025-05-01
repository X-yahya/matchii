const createError = require("../utils/createError"); ;
const Gig = require("../models/gig.model") ;

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

 const getGig = async (req , res , next) =>
{
  try{
    const gig = await Gig.findById(req.params.id) ;
    if(!gig) return next(createError(404 , "Gig not found")) ; 
    res.status(200).send(gig) ; 
  }catch(err)
  {
    console.log(err) ; 
    next(err); 
  }
}

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

  try {
    // Fetch gigs based on filters
    const gigs = await Gig.find(filters);
    res.status(200).send(gigs);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {createGig , deleteGig , getGig , getGigs} ;