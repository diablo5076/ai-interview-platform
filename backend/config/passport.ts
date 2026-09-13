import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { prisma } from "../lib/prisma.js";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if (!clientID || !clientSecret || !callbackURL) {
  console.warn(
    "Google OAuth is not configured. Missing Google OAuth environment variables."
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value
            ?.trim()
            .toLowerCase();

          if (!email) {
            return done(
              new Error("Google account does not have an email address")
            );
          }

          // 1. Check whether this Google account already exists
          const existingGoogleUser = await prisma.user.findUnique({
            where: {
              googleId,
            },
          });

          if (existingGoogleUser) {
            return done(null, existingGoogleUser);
          }

          // 2. Check whether an account with this email already exists
          const existingEmailUser = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (existingEmailUser) {
            // Link Google account to the existing user
            const linkedUser = await prisma.user.update({
              where: {
                id: existingEmailUser.id,
              },
              data: {
                googleId,
              },
            });

            return done(null, linkedUser);
          }

          // 3. Create a new Google user
          const newUser = await prisma.user.create({
            data: {
              email,
              googleId,
              password: null,
            },
          });

          return done(null, newUser);
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error as Error);
        }
      }
    )
  );
}

export default passport;