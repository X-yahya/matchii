//
const Review = require('../models/Review.model') ;
const Gig = require('../models/Gig.model') ;
const createError = require('../utils/createError') ;

const createReview = async (req, res, next) => {
    if (req.isSeller) return next(createError(403, "Sellers can't create reviews"));
  
    try {
      const existingReview = await Review.findOne({
        userId: req.userId,
        gigId: req.body.gigId
      });
  
      if (existingReview) {
        return next(createError(403, "You already reviewed this gig"));
      }
  
      const review = new Review({
        userId: req.userId,
        gigId: req.body.gigId,
        desc: req.body.desc,
        star: req.body.star,
      });
  
      const savedReview = await review.save();
      
      await Gig.findByIdAndUpdate(req.body.gigId, {
        $inc: { totalStars: req.body.star, starNumber: 1 },
      });

      res.status(201).json(savedReview);
    } catch (err) {
      next(err);
    }
  };
  
  const getReviews = async (req, res, next) => {
    try {
      const reviews = await Review.find({ gigId: req.params.gigId })
        .populate('userId', 'username image country')
        .sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (err) {
      next(err);
    }
  };
  
 


const deleteReview = async (req , res , next)=>
{
    try {
        const review = await Review.findById(req.params.id) ;
        if(!review) return next(createError(404 , "Review not found")) ; 
        if(review.userId !== req.userId) return next(createError(403 , "You can only delete your own reviews")) ; 
        await Review.findByIdAndDelete(req.params.id) ; 
        res.status(200).json("Review has been deleted") ;
                
    } catch (err) {
        next(err);
        
                
    }
}



module.exports = { createReview , getReviews , deleteReview } ;