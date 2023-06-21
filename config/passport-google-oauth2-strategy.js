const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use new startegy to google login
passport.use(new googleStrategy({
    clientID:"517155448198-0pfcgfmv4htbepvpj7033tou9r2urcp2.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
    }, 
    function(accessToken, refreshToken, profile, done ){
        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log("error in google strategy passport", err); return;}

            console.log(profile);

            if(user){
                //if found, set this user as req.user
                return done(null, user);
            }else{
                //if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log("error in creating user google strategy-passport", err); return;}
                    return done(null, user);
                });
            }
            
        });
    }
));


module.exports = passport;