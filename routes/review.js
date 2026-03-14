const express = require("express");
const router = express.Router({mergeParams : true});
const listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");




// review route
router.post("/", isLoggedIn,validateReview, WrapAsync(async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    req.flash("success", " New review added Successfully");
    await newReview.save();
    await list.save();
    
    res.redirect(`/listings/${list._id}`);
}));

// Delete review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,WrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;