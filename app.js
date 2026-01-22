const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./modules/listing.js");
const path = require("path");
const methodOverride = require("method-override");   


main().then(() => {
    console.log("DB connected");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
};

// smaple testin

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
app.get("/",(req, res)=> {
    res.send("Root is working");
})
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//index Route

app.get("/listings", async (req, res)=> {
    const allListings = await listing.find({});
    res.render("listings/index", { allListings });
})

// create route
app.get("/listings/new", (req, res) => {
    res.render("listings/newList.ejs");
})

// create route
app.post("/listings", async (req, res) => {
    let { title, description, price, location, country } = req.body;
    let newList = await new listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
    });

    await newList.save();
    // console.log(newList);
    res.redirect("/listings");

})

// particular list
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    // console.log(list);
    res.render("listings/show.ejs", { list });
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const editingList = await listing.findById(id);
    res.render("listings/edit.ejs", { editingList });
})

// update route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;

  await listing.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      description: req.body.description,
        "image.url": req.body.image.url,
      "image.filename":req.body.image.filename,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country
    },
    { new: true, runValidators: true }
  );

  res.redirect(`/listings/${id}`);
});

// delete route

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
})

app.listen(3000, () => {
    console.log("3000 port is listening");
})