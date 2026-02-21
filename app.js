if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require('./routes/reviews.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoutes = require('./routes/user.js');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const MongoStore = require('connect-mongo');

const dbURL = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET,
    } ,
    touchAfter : 24 * 3600,
});

store.on("error",(err)=>{
    console.log("Error in mongo session store", err);
});

const sessionOption = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : new Date(Date.now() + 7*24*60*60*1000),
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
};




app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(methodOverride('_method'));

main().then(()=>{
    console.log("Data base is connected");
}).catch((err)=>{
    console.log("Database error");
});


app.get("/",(req,res)=>{
    res.redirect("/listings");
});


async function main(){
    await mongoose.connect(dbURL);
}


app.use((req,res,next)=>{
    res.locals.message = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.register = req.flash("register");
    res.locals.currUser = req.user || null;


    // console.log(req.flash("error"));
    next();
});



// //root route
// app.get("/",(req,res)=>{
//       res.send("root is listening");
// });



//listing routes

app.use('/listings',listingRoute);




//Reviews
app.use('/listings/:id/reviews',reviewRoute);


//User Routes
app.use('/',userRoutes);





app.use((req,res,next)=>{
   next(new ExpressError(404,"Page Not Found!!!"));
});

app.use((err,req,res,next)=>{
    let {status = 500,message = "Something went wrong"} = err;
    res.status(status).render("error.ejs",{err});
    // res.status(status).send(message);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
