import User from '../models/user.mjs'
import mongoose from 'mongoose'

export const getCurrentUser = async (req, res, next) => {}

export const getUserId = async (req, res, next) => {
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
