const Review = require('../models/review.model');
const Gig = require('../models/gig.model'); // Fixed: should be lowercase 'gig.model'
const Order = require('../models/order.model'); // You need to import Order model
const createError = require('../utils/createError');

const createReview = async (req, res, next) => {
  try {
    // 1. Check if user is seller
    if (req.isSeller) {
      return next(createError(403, "Sellers can't create reviews!"));
    }

    // 2. Verify purchase exists - CRITICAL: Check for completed orders only
    const order = await Order.findOne({
      gigId: req.body.gigId,
      buyerId: req.userId,
      isCompleted: true,
      status: 'completed'
    });

    if (!order) {
      return next(createError(403, "Valid purchase required to review..."));
    }

    // 3. Check for existing review
    const existingReview = await Review.findOne({
      userId: req.userId,
      gigId: req.body.gigId
    });

    if (existingReview) {
      return next(createError(403, "You have already reviewed this service!"));
    }

    // 4. Validate review data
    if (!req.body.desc || !req.body.star) {
      return next(createError(400, "Review description and rating are required!"));
    }

    if (req.body.star < 1 || req.body.star > 5) {
      return next(createError(400, "Rating must be between 1 and 5 stars!"));
    }

    // 5. Create review
    const review = new Review({
      userId: req.userId,
      gigId: req.body.gigId,
      desc: req.body.desc.trim(),
      star: parseInt(req.body.star)
    });

    // 6. Save review and update gig ratings
    const savedReview = await review.save();
    
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { 
        totalStars: parseInt(req.body.star), 
        starNumber: 1 
      }
    });

    res.status(201).json(savedReview);
  } catch (err) {
    next(err);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId })
      .populate('userId', 'username image'); // <-- use 'image' instead of 'avatar'
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return next(createError(404, "Review not found"));
    }
    
    if (review.userId !== req.userId) {
      return next(createError(403, "You can only delete your own reviews"));
    }

    // Update gig ratings when deleting review
    await Gig.findByIdAndUpdate(review.gigId, {
      $inc: { 
        totalStars: -review.star, 
        starNumber: -1 
      }
    });

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json("Review has been deleted");
  } catch (err) {
    next(err);
  }
};

module.exports = { createReview, getReviews, deleteReview };