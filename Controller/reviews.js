const Listing = require("../models/listing");
const Review = require("../models/review");



module.exports.postReview = async (req,res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  const newreview = new Review(req.body.review);
  newreview.owner = req.user._id;
  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash("success","Review Posted Successfully");
  res.redirect(`/listings/${id}`)
//   listing.reviews.push(listing);
//   console.log(listing);

}

module.exports.deleteReview = async (req,res)=>{
    const {id,revID} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : revID}});
    await Review.findByIdAndDelete(revID);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
    // res.send("delete route");
}