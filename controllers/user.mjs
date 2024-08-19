import User from '../models/user.mjs'
import mongoose from 'mongoose'

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            req.status(404).json({ error: 'User does not exist' })
        } else {
            res.status(200).json({ user: req.user })
        }
    } catch (err) {
        res.status(500).json({
            error: 'An error occurred while fetching user',
        })
    }
}

const getUserId = async (req, res, next) => {
    const { userId } = req.params.userId
    try {
        const user = await User.findOne({ _id: userId })
        if (!user) {
            req.status(404).json({ error: 'User does not exist' })
        } else {
            res.status(200).json({ user: user })
        }
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while fetching user',
        })
    }
}

export { getUserId, getCurrentUser }
