const Gig = require("../models/gig.model");


const Order = require("../models/oder.model") ; 



const createOrder = async (req, res, next) => {
    try
    {
        const gig = await Gig.findById(req.params.gigId) ; 
        if(!gig) return next(createError(404 , "Gig not found")) ;
        if(gig.userId === req.userId) return next(createError(403 , "You can't order your own gig")) ;
        const selectedPlan = gig.plans[0]; // Adjust this logic as needed
        if (!selectedPlan || !selectedPlan.price) {
            return next(createError(400, "Invalid plan or price not found"));
        }
        const newOrder = new Order({
            gigId : gig._id ,
            img : gig.coverImage ,
            title : gig.title ,
            price : selectedPlan.price ,
            buyerId : req.userId ,
            sellerId : gig.userId ,
        }) ;
        await newOrder.save() ;
        res.status(201).json("order has been created") ;

    }catch(err)
    {
        next(err);
    }   


}   

const getOrders = async (req, res, next) => {
  try {
    // Get orders with user IDs
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      
    });

    // Get unique user IDs
    const userIds = [
      ...new Set(orders.flatMap(order => [order.buyerId, order.sellerId]))
    ];

    // Get user names in single query
    const users = await User.find(
      { _id: { $in: userIds } },
      { _id: 1, name: 1 }
    );

    // Create user map for quick lookup
    const userMap = new Map(users.map(user => [user._id.toString(), user.name]));

    // Enhance orders with names
    const enhancedOrders = orders.map(order => ({
      ...order._doc,
      buyerName: userMap.get(order.buyerId.toString()) || 'Unknown Buyer',
      sellerName: userMap.get(order.sellerId.toString()) || 'Unknown Seller'
    }));

    res.status(200).json(enhancedOrders);
  } catch (err) {
    next(err);
  }
};


module.exports = {
    createOrder , 
    getOrders
} ;
