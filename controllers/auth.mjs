import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { config } from 'dotenv'
import User from '../models/user.mjs'
config()

const postSignup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name: userName,
            email,
            password: hashedPassword,
        })
        await newUser.save()
        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'An error occurred while registering the user',
        })
    }
}

const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const token = jsonwebtoken.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(() => {
            res.status(200).json({ token })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Unknown error' })
    }
}

const postForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        // Check if the user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex')
        user.resetToken = resetToken
        user.resetTokenExpiration = Date.now() + 3600000 // Token expires in 1 hour
        await user.save()
        res.status(200).json({ message: 'Password reset token sent' })
    } catch (error) {
        console.error('Error generating reset token:', error)
        res.status(500).json({
            error: 'An error occurred while generating the reset token',
        })
    }
}

const postResetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body

        // Find the user with the provided reset token
        const user = await User.findOne({
            resetToken,
            resetTokenExpiration: { $gt: Date.now() },
        })
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Invalid or expired reset token' })
        }

        // Encrypt and hash the new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // Update the user's password and reset token fields
        user.password = hashedPassword
        user.resetToken = undefined
        user.resetTokenExpiration = undefined
        await user.save()

        res.status(200).json({ message: 'Password reset successful' })
    } catch (error) {
        console.error('Error resetting password:', error)
        res.status(500).json({
            error: 'An error occurred while resetting the password',
        })
    }
}

const postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}

export {
    postSignup,
    postLogin,
    postForgotPassword,
    postResetPassword,
    postLogout,
}
