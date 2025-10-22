const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require('./review.js');

const listingSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
       url : String,
       filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review",
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    geometry :  {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post('findOneAndDelete',async (data)=>{
    if(data){
  await Review.deleteMany({_id : {$in : data.reviews}});
    }
});

const listing = mongoose.model("listing",listingSchema);

module.exports = listing;