const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../Controller/listings.js");
const {storage} = require("../cloudConfig.js");
const {cloudinary} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.create));




//New Route
router.get("/new",isLoggedIn,listingController.new);


router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.put))
.delete(isLoggedIn,isOwner,listingController.delete);


//edit
router.get("/:id/edit",isLoggedIn,isOwner,listingController.edit);



module.exports = router;
