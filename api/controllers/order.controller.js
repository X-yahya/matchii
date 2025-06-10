const Gig = require("../models/gig.model");
const Order = require("../models/order.model"); // Note: Fix the typo in filename if possible
const User = require("../models/user.model");
const createError = require("../utils/createError");
const createOrder = async (req, res, next) => {
  try {
    const { planIndex } = req.body;
    const gig = await Gig.findById(req.params.gigId);
    
    if (!gig) return next(createError(404, "Gig not found"));
    if (!gig.plans || !gig.plans[planIndex]) {
      return next(createError(400, "Invalid plan selection"));
    }
    if (gig.userId === req.userId) {
      return next(createError(403, "You can't order your own gig"));
    }

    const selectedPlan = gig.plans[planIndex];
    
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.coverImage,
      title: gig.title,
      price: selectedPlan.price,
      buyerId: req.userId,
      sellerId: gig.userId,
      planIndex,
      planDetails: {
        name: selectedPlan.name,
        price: selectedPlan.price,
        deliveryDays: selectedPlan.deliveryDays,
        revisions: selectedPlan.revisions,
        features: selectedPlan.features
      },
      buyerAccepted: true,
      status: 'pending'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            $or: [
                { buyerId: req.userId },
                { sellerId: req.userId }
            ]
        }).sort({ createdAt: -1 });

        const userIds = [
            ...new Set(orders.flatMap(order => [order.buyerId, order.sellerId]))
        ];

        const users = await User.find(
            { _id: { $in: userIds } },
            { _id: 1, username: 1, image: 1 }
        );

        const userMap = new Map(users.map(user => [user._id.toString(), user]));

        const enhancedOrders = orders.map(order => ({
            ...order._doc,
            buyer: userMap.get(order.buyerId.toString()) || { username: 'Unknown Buyer' },
            seller: userMap.get(order.sellerId.toString()) || { username: 'Unknown Seller' }
        }));

        res.status(200).json(enhancedOrders);
    } catch (err) {
        next(err);
    }
};

const getOrdersByGig = async (req, res, next) => {
    try {
        const { gigId, status } = req.query;
        
        if (!gigId) {
            return next(createError(400, "Gig ID is required"));
        }

        const filters = { gigId };
        
        // Add status filter if provided
        if (status) {
            filters.status = status;
        }

        const orders = await Order.find(filters);
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(createError(404, "Order not found"));

        const isSeller = order.sellerId === req.userId;
        const isBuyer = order.buyerId === req.userId;
        
        if (!isSeller && !isBuyer) {
            return next(createError(403, "Unauthorized"));
        }

        switch (req.body.action) {
            case 'accept':
                if (isSeller) order.sellerAccepted = true;
                if (isBuyer) order.buyerAccepted = true;
                
                if (order.buyerAccepted && order.sellerAccepted) {
                    order.status = 'inProgress';
                }
                break;

            case 'refuse':
                order.status = 'refused';
                break;

            case 'complete':
                if (isSeller) order.sellerCompleted = true;
                if (isBuyer) order.buyerCompleted = true;
                
                if (order.buyerCompleted && order.sellerCompleted) {
                    order.status = 'completed';
                    order.isCompleted = true;
                    
                    // Increment gig sales when order is completed
                    await Gig.findByIdAndUpdate(order.gigId, {
                        $inc: { sales: 1 }
                    });
                }
                break;

            default:
                return next(createError(400, "Invalid action"));
        }

        await order.save();
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

// Enhanced purchase verification for review eligibility
const checkOrder = async (req, res, next) => {
    try {
        // Check for completed orders only
        const completedOrder = await Order.findOne({
            gigId: req.params.gigId,
            buyerId: req.userId,
            isCompleted: true,
            status: 'completed'
        });
        
        res.status(200).json(!!completedOrder);
    } catch (err) {
        next(err);
    }
};

// Additional helper function to get purchase history
const getPurchaseHistory = async (req, res, next) => {
    try {
        const purchases = await Order.find({
            buyerId: req.userId,
            isCompleted: true,
            status: 'completed'
        }).populate('gigId', 'title coverImage');
        
        res.status(200).json(purchases);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrdersByGig,
    updateOrderStatus,
    checkOrder,
    getPurchaseHistory
};