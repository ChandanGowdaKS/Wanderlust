const listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);
    req.flash("success", " New review added Successfully");
    await newReview.save();
    await list.save();
    
    res.redirect(`/listings/${list._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted Successfully");
    res.redirect(`/listings/${id}`);
};