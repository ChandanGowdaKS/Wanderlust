const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync");
const multer = require("multer");
const {storage} = require("../clouldConfig.js")
const upload = multer({storage});

const {isLoggedIn,isOwner,validationListing} = require("../middleware.js");

//controller
const listingController = require("../controllers/listings.js");


//index Route
router.route("/")
.get( WrapAsync(listingController.index))
.post( isLoggedIn, upload.single("listing[image]"),validationListing, WrapAsync(listingController.createNewListing));



// create route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( WrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, validationListing,WrapAsync(listingController.editListing))
.delete(isLoggedIn,isOwner, WrapAsync(listingController.deleteListing));


// edit route
router.get("/:id/edit", isLoggedIn,isOwner,WrapAsync(listingController.editListingForm));



module.exports = router;