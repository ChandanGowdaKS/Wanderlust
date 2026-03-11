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
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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





// listings route in route folder
app.use("/listings",listings)


// listings of review in route folder

app.use("/listings/:id/reviews", reviews);

// error handling for not found pages
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


//custom middleware to handle error
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message }); 
});

app.listen(3000, () => {
    console.log("3000 port is listening");
});