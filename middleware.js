const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.originalUrl = req.originalUrl;
        req.flash("error","Please login first!!!");
        res.redirect("/login");
    }
    else{
    next();
    }
}

module.exports.saveRedirect = (req,res,next)=>{
    if(req.session.originalUrl){
        res.locals.Url = req.session.originalUrl;
    }
    next();
}


module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!(listing.owner).equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing!");
    res.redirect(`/listings/${id}`);
   }else{
    return next();
   }
}

module.exports.validateListing = (req,res,next)=>{
     let {error} = listingSchema.validate(req.body);
   if(error){
     let errMsg =  error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else
   {
    next();
   }
}

module.exports.validateReview = (req,res,next)=>{
     let {error} = reviewSchema.validate(req.body);
   if(error){
     let errMsg =  error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else
   {
    next();
   }
}


module.exports.isReviewOwner = async (req,res,next)=>{
    let {id,revID} = req.params;
    let review = await Review.findById(revID);
    if(!(review.owner).equals(res.locals.currUser._id)){
            req.flash("error","You are not the owner of this review!");
            res.redirect(`/listings/${id}`);
    }else{
        return next();
    }
}