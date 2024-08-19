import express from 'express'
import * as userController from '../controllers/user.mjs'
import passport from 'passport'
const router = express.Router()

router.get(
    '/currentUser',
    passport.authenticate('jwt', { session: false }),
    userController.getCurrentUser
)

export default router
// , (err, user, info) => {
//     console.log(err)
//     console.log(user)
//     console.log(info)
// }
