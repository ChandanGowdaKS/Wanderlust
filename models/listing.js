const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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

    price: Number,
    location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
      },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;