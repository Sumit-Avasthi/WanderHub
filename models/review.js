const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : Number,
        min : 0,
        max : 5,
    },
    created_At : {
        type : Date,
        default : Date.now(),
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
});


module.exports = mongoose.model("Review",reviewSchema);