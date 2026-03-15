const express = require("express");
const app = express();
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");   
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// middlewares
const { validationListing, } = require("./middleware.js");

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



const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

// passport for user authentication   // pbkdf2 hashing algorithm
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted"); 
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user;
    next();
});

app.get("/", WrapAsync(async (req, res,next) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
}));





// listings route in route folder
app.use("/listings",listingRouter)


// listings of review in route folder

app.use("/listings/:id/reviews", reviewRouter);

// user router

app.use("/", userRouter);

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