const FortyTwoStrategy = require('passport-42').Strategy;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new FortyTwoStrategy({
        clientID: '660f7099c815005459ae091f05b7fbc6951971f8845e2cf2ba1b8cdfb17ee034',
        clientSecret: '15d715e1a1ca7f665d130402a9f45c7fcc1abc1cdbde3496b249ad95d8d7cbd5',
        callbackURL: "http://localhost:8081/users/auth42"
      },
      (token, refreshToken, profile, done) => {
          return done(null, {
              profile: profile,
              token: token
          });
  }));
};
