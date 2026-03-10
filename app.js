const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");   
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");



main().then(() => {
    console.log("DB connected");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
};

// sample testing

// app.get("/testing", async (req, res) => {
//     let sampleListing = new listing({
//         title: "MoonSpace",
//         description: "Easy to see all other planets",
//         Price: 4000,
//         location: "Bengaluru",
//         country: "India",
//     });
//     console.log(sampleListing + "Saved");
//     await sampleListing.save();
//     res.send("Saved");
// })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", WrapAsync(async (req, res,next) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
}));


// validation middleware
const validationListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// validate review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

//index Route

app.get("/listings", WrapAsync(async (req, res, next) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
}));

// create route
app.get("/listings/new", (req, res) => {
    res.render("listings/newList.ejs");
})

// create route
app.post("/listings", validationListing,WrapAsync(async (req, res, next) => {
    let newList = await new listing(req.body.listing);

        await newList.save();
        // console.log(newList);
        res.redirect("/listings");
    } 
    

));

// particular list show route
app.get("/listings/:id",WrapAsync( async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate("reviews");
    // console.log(list);
    res.render("listings/show.ejs", { list });
}));

// edit route
app.get("/listings/:id/edit", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const editingList = await listing.findById(id);
    res.render("listings/edit.ejs", { editingList });
}));

// update route
app.put("/listings/:id", validationListing,WrapAsync(async (req, res, next) => {
  const { id } = req.params;

  await listing.findByIdAndUpdate(id,{ ...req.body.listing});

  res.redirect(`/listings/${id}`);
}));

// delete route

app.delete("/listings/:id", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
}));

// review route
app.post("/listings/:id/reviews", validateReview, WrapAsync(async (req, res) => {
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    
    res.redirect(`/listings/${list._id}`);
}));

// Delete review route
app.delete("/listings/:id/reviews/:reviewId", WrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

// error handling for not found pages
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


//custom middleware to handle error
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message }); 
});

app.listen(3000, () => {
    console.log("3000 port is listening");
});