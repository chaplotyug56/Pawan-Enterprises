const Review = require("../models/Review");
const Product = require("../models/Product");

const addReview = async (req, res) => {

try{

const {rating,comment}=req.body;
if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }
  
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: req.params.id,
  });
  
  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this product.",
    });
  }
const review=await Review.create({

user:req.user.id,

product:req.params.id,

rating,

comment

});

const reviews=await Review.find({
product:req.params.id
});

const average =
  reviews.length > 0
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : 0;

await Product.findByIdAndUpdate(req.params.id,{

averageRating:average,

reviewCount:reviews.length

});

res.json({

success:true,

data:review

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
const getProductReviews = async (req, res) => {
    try {
      const reviews = await Review.find({
        product: req.params.id,
      }).populate("user", "name");
  
      res.json({
        success: true,
        data: reviews,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  const getAllReviews = async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate("user", "name email")
        .populate("product", "name");
  
      res.json({
        success: true,
        data: reviews,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  
  const deleteReview = async (req, res) => {
    try {
      await Review.findByIdAndDelete(req.params.id);
  
      res.json({
        success: true,
        message: "Review Deleted",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  module.exports = {
    addReview,
    getProductReviews,
    getAllReviews,
    deleteReview,
  };