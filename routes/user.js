const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utils/WrapAsync");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", WrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "welcome to Wanderlust");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

module.exports = router;