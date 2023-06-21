const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    function(email, password, done){
        //find the user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                console.log('Error in finding the user-->Passport');
                return done(err);
            }

            if(!user||user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

//serialize the user to decide which key is to be kept in cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



//deserialize the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding the user--> Passport');
            return done(err);
        }
        return done(null, user);
    })
})

//check if user is authenticated

passport.checkAuthenticationn = function(req, res, next){
    //if the user is signed in then pass on the request to the next function
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect('/users/sign-in');
}

//
passport.setAuthenticatedUser =function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed user from the session cookie and we are just sending this to the locals for the views 
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;