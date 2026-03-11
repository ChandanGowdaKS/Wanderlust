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
        // console.log(newList);
        res.redirect("/listings");
    } 
    

));

// particular list show route
router.get("/:id",WrapAsync( async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate("reviews");
    // console.log(list);
    res.render("listings/show.ejs", { list });
}));

// edit route
router.get("/:id/edit", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const editingList = await listing.findById(id);
    res.render("listings/edit.ejs", { editingList });
}));

// update route
router.put("/:id", validationListing,WrapAsync(async (req, res, next) => {
  const { id } = req.params;

  await listing.findByIdAndUpdate(id,{ ...req.body.listing});

  res.redirect(`/listings/${id}`);
}));

// delete route

router.delete("/:id", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
}));

module.exports = router;