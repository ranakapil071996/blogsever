const  passportJWT = require("passport-jwt");
const { jwtSecretKey } = require(".");
const User = require("../models/User");

// passport & jwt config
const {
  Strategy: JWTStrategy,
  ExtractJwt: ExtractJWT,
} = passportJWT;


// define passport jwt strategy
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSecretKey;
const passportJWTStrategy = new JWTStrategy(opts, function(jwtPayload, done) {
  // retrieve mail from jwt payload
  const email = jwtPayload.email;

  // if mail exist in database then authentication succeed
  User.findOne({email: email}, (error, user) => {
    if (error) {
      return done(error, false);
    } else {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }
  });
});

// config passport
module.exports = function(passport) {
  // token strategy
  passport.use(passportJWTStrategy);

  // return configured passport
  return passport;
};