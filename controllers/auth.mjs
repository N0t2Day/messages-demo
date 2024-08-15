const crypto = require('crypto')
const bcrypt = require('bcryptjs')

import User from '../models/user.mjs'

export const postSignup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        const newUser = new User({
            name: userName,
            email,
            password,
        })
        await newUser.save()
        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while registering the user',
        })
    }
}

export const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const token = jwt.sign({ userId: user._id }, 'secretKey')
        req.session.isLoggedIn = true
        req.session.user = user
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' })
    }
}
