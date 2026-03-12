const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

// validation middleware
const validationListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

//index Route

router.get("/", WrapAsync(async (req, res, next) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
}));

// create route
router.get("/new", (req, res) => {
    res.render("listings/newList.ejs");
})

// create route
router.post("/", validationListing,WrapAsync(async (req, res, next) => {
    let newList = await new listing(req.body.listing);

        await newList.save();
    req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } 
    

));

// particular list show route // Show Route
router.get("/:id",WrapAsync( async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate("reviews");
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs", { list });
}));

// edit route
router.get("/:id/edit", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const editingList = await listing.findById(id);
    if (!editingList) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { editingList });
}));

// update route
router.put("/:id", validationListing,WrapAsync(async (req, res, next) => {
  const { id } = req.params;

    const updatedListing = await listing.findByIdAndUpdate(id,{ ...req.body.listing});
    if (!updatedListing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
        req.flash("success", " Listing edited Successfully");
  res.redirect(`/listings/${id}`);
}));

// delete route

router.delete("/:id", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    if (!deletedList) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    req.flash("deleted", `${deletedList.title} listing deleted Successfully` );
    res.redirect("/listings");
}));

module.exports = router;