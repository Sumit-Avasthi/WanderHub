const Listing = require("../models/listing");
const axios = require("axios");
const {cloudinary,storage} = require("../cloudConfig");

module.exports.index = async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}


module.exports.new = (req,res)=>{
    res.render("listings/new.ejs");
}


module.exports.create = async (req,res,next)=>{
    let {country,location} = req.body.listing;
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location +','+country)}&format=geojson`;
    const response = await axios.get(geoUrl);
    if(!response.data.features.length){
        req.flash("error","Invalid Location");
        res.redirect("/listings/new");
    }else{
    // console.log(response.data.features[0].geometry);
    let url = req.file.path;
    let filename = req.file.filename;
   const listing = new Listing(req.body.listing);
   listing.owner  = req.user._id;
   listing.image = {url,filename};
   listing.geometry = response.data.features[0].geometry;
    let s = await listing.save();
    // console.log(s);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    }
}


module.exports.show = async (req,res)=>{
const {id} = req.params;
const data =  await Listing.findById(id).populate({path :"reviews", populate : { path : "owner" ,},}).populate("owner");
if(!data){
    req.flash("error","Listing Does Not EXIST!!!");
    res.redirect("/listings");
}else{
res.render("listings/show.ejs",{ data });
}

}


module.exports.put = async (req,res)=>{
   let {id} = req.params;
   const data = req.body.listing;
   Listing.findByIdAndUpdate(id,{
    title : data.title,
    description : data.description,
    price : data.price,
    country : data.country,
    location : data.location,
   }).then(async (data)=>{
    if(typeof req.file != "undefined"){
           let url = req.file.path;
           let filename = req.file.filename;
        data.image = {url,filename};
        const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.location +','+data.country)}&format=geojson`;
         const response = await axios.get(geoUrl);
         data.geometry = response.data.features[0].geometry;
        await data.save();
    }
    req.flash("success","Updated Successfully");
    res.redirect(`/listings/${id}`);
   }).catch((err)=>{
      res.send("Updation Error");
   });

}


module.exports.delete = async (req,res)=>{
        const {id} = req.params;
         const listing = await Listing.findById(id);
          if (!listing) {
                req.flash("error", "Listing not found!");
                return res.redirect("/listings");
            }
        if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
        Listing.findByIdAndDelete(id).then(()=>{
            req.flash("success","Deleted Successfully");
            res.redirect("/listings");
        }).catch((err)=>{
            res.send("Database Error");
        });
}


module.exports.edit = async (req,res)=>{
    const {id} = req.params;
    const data  = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing Does Not EXIST!!!");
       res.redirect("/listings");
    }else{
    let originalimageurl = data.image.url;
    originalimageurl= originalimageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{data,originalimageurl});
    }
}