import express from 'express'
import { check, body } from 'express-validator'
import authController from '../controllers/auth.mjs'
import User from '../models/user.mjs'

const router = express.Router()

router.post('/signup', await authController.postSignup)
router.post('/login', await authController.postLogin)
