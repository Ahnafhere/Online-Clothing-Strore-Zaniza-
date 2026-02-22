const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'PLACEHOLDER_SECRET',
    callbackURL: `${process.env.CLIENT_URL || 'http://localhost:5000'}/api/auth/google/callback`
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // Check if user exists with same email (link accounts)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Update googleId if not set, and update image if available
                if (!user.googleId) user.googleId = profile.id;
                if (profile.photos && profile.photos[0]) user.image = profile.photos[0].value;
                await user.save();
                return done(null, user);
            }

            // Create new user
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                password: 'google-oauth-login-' + Math.random().toString(36).slice(-8), // Dummy password
                isVerified: true
            });

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
