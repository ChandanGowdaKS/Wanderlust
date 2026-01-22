const mongoose = require("mongoose");

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // image: {
    //     type: String,
    //     default: "https://cdn.pixabay.com/photo/2024/05/01/12/59/nature-8732304_1280.jpg",
    //     set: (v) => v === " " ?
    //         "https://cdn.pixabay.com/photo/2024/05/01/12/59/nature-8732304_1280.jpg"
    //         : v,
    // },

    image: {
  filename: {
    type: String
  },
  url: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2024/05/01/12/59/nature-8732304_1280.jpg"
  },
},

  price: {
    type: Number,
    required:true,
    },
    location: String,
    country: String,
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;