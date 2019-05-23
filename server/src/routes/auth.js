const GoogleStrategy = require('passport-google-oauth20').Strategy;
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: '320227797140-sqk36f7t9lcn2ms1gv1nnjbvgvkat232.apps.googleusercontent.com',
            clientSecret: 'YmYsqE6mC_4UatsnQZPkibvN',
            callbackURL: 'http://localhost:8081/users/google/googleRegister'
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};
