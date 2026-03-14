const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync");

const {isLoggedIn,isOwner,validationListing} = require("../middleware.js");



//index Route

router.get("/", WrapAsync(async (req, res, next) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
}));

// create route
router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/newList.ejs");
})

// create route
router.post("/", isLoggedIn, validationListing,WrapAsync(async (req, res, next) => {
    let newList = await new listing(req.body.listing);
    newList.owner = req.user._id;

    await newList.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    } 
    

));

// particular list show route // Show Route
router.get("/:id", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate({ path:"reviews", populate:{ path:"author"},}).populate("owner");
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs", { list });
}));

// edit route
router.get("/:id/edit", isLoggedIn,isOwner,WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const editingList = await listing.findById(id);
    if (!editingList) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { editingList });
}));

// update route
router.put("/:id",isLoggedIn,isOwner, validationListing,WrapAsync(async (req, res, next) => {
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

router.delete("/:id",isLoggedIn,isOwner, WrapAsync(async (req, res, next) => {
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