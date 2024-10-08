import express from 'express'
import * as messageController from '../controllers/message.mjs'
import passport from 'passport'
import multer from '../middleware/multer.mjs'
const router = express.Router()

router.post(
    '/message',
    passport.authenticate('jwt', { session: false }),
    multer.single('fileData'),
    messageController.postMessage
)

router.post(
    '/reply',
    passport.authenticate('jwt', { session: false }),
    messageController.postReply
)

router.get(
    '/message/:messageId',
    passport.authenticate('jwt', { session: false }),
    messageController.getMessageById
)

router.get(
    '/messages/:userId',
    passport.authenticate('jwt', { session: false }),
    messageController.getUserMessages
)

router.get(
    '/messages',
    passport.authenticate('jwt', { session: false }),
    messageController.getAllMessages
)

export default router
