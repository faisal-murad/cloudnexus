
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3020/auth/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    // Check for errors
    if (!profile) {
      return done(new Error("No profile found"));
    }

    console.log('profile = ', profile);
    // Assuming you handle the user creation or retrieval elsewhere, you can return the user profile here
    return done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});