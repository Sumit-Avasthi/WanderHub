const User = require("../models/user");


module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.postSignUp = async (req,res)=>{
    try{
     let {username,email,password} = req.body;
     const newUser = new User({
        email : email,
        username : username,
     });

    let data = await User.register(newUser,password);
    req.login(data,(err)=>{
        if(err){
            return next(err);
        }else{
              req.flash("register","Welcome to WanderLust");
    res.redirect("/listings");
        }
    });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin = async (req,res)=>{
       req.flash("success",`Welcome back ${req.body.username} !!`);
       let redirectUrl = res.locals.Url || "/listings";
       res.redirect(redirectUrl);
}


module.exports.logOut = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","You're logged out");
            res.redirect('/listings');
        }
    });
}