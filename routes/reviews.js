const express = require('express');
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn,isReviewOwner,validateReview} = require("../middleware.js");
const reveiwController = require("../Controller/reviews.js");




//Post review
router.post("/",isLoggedIn,validateReview,wrapAsync(reveiwController.postReview));

//Delete Review
router.delete("/:revID",isLoggedIn,isReviewOwner,wrapAsync(reveiwController.deleteReview));


module.exports = router;