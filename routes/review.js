const express = require("express");
const router = express.Router({mergeParams : true});
const listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");

// validate review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};


// review route
router.post("/", validateReview, WrapAsync(async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    list.reviews.push(newReview);
    req.flash("success", " New review added Successfully");
    await newReview.save();
    await list.save();
    
    res.redirect(`/listings/${list._id}`);
}));

// Delete review route
router.delete("/:reviewId", WrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;