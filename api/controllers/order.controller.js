// const Gig = require("../models/gig.model");
// const Order = require("../models/order.model");
const Gig = require("../models/gig.model") ; 
const Order = require("../models/oder.model") ; 
const User = require("../models/user.model");
const createError = require("../utils/createError")
const createOrder = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.gigId);
        if (!gig) return next(createError(404, "Gig not found"));
        if (gig.userId === req.userId) return next(createError(403, "You can't order your own gig"));
        
        const selectedPlan = gig.plans[0];
        if (!selectedPlan?.price) {
            return next(createError(400, "Invalid plan or price not found"));
        }

        const newOrder = new Order({
            gigId: gig._id,
            img: gig.coverImage,
            title: gig.title,
            price: selectedPlan.price,
            buyerId: req.userId,
            sellerId: gig.userId,
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

const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return next(createError(404, "Order not found"));

        const isSeller = order.sellerId === req.userId;
        const isBuyer = order.buyerId === req.userId;
        if (!isSeller && !isBuyer) return next(createError(403, "Unauthorized"));

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

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};