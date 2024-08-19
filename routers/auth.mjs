import express from 'express'
import { check, body } from 'express-validator'
import * as authController from '../controllers/auth.mjs'

const router = express.Router()

router.post('/signup', authController.postSignup)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)

export default router
