const listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/newList.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
    let newListing = await new listing(req.body.listing);
    
    newListing.owner = req.user._id;
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}; 

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!list) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    };
    res.render("listings/show.ejs", { list });
};
    
module.exports.editListingForm = async (req, res, next) => {
    let { id } = req.params;
    const editingList = await listing.findById(id);
    if (!editingList) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { editingList });
};

module.exports.editListing = async (req, res, next) => {
    const { id } = req.params;

    const updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (!updatedListing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    req.flash("success", " Listing edited Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    if (!deletedList) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    req.flash("deleted", `${deletedList.title} listing deleted Successfully`);
    res.redirect("/listings");
};

