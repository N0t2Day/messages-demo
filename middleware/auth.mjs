import passport from 'passport'
import User from '../models/user.mjs'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { config } from 'dotenv'
config()

let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}
passport.use(
    new Strategy(options, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.userId)
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (error) {
            console.error(error)
            return done(error, false)
        }
    })
)
