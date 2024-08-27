import Message from '../models/message.mjs'
import User from '../models/user.mjs'
import * as storage from '../services/storage.mjs'
const PER_PAGE = 20

const getAllMessages = async (req, res, next) => {
    const userId = req.user.id
    const page = req.query.page
    try {
        const messages = await Message.find({
            owner: userId,
        })
            .skip((page - 1) * PER_PAGE)
            .limit(PER_PAGE)
        res.status(200).json({ messages: messages })
    } catch (error) {
        res.status(500).json({ error: 'Unknown error' })
    }
}

const getMessageById = async (req, res, next) => {
    const messageId = req.query.messageId
    try {
        const message = await Message.findOne({ _id: messageId })
        if (!message) {
            res.status(404).json({ error: 'Message does not exist' })
        } else {
            res.status(200).json({ message: message })
        }
    } catch (error) {
        res.status(500).json({ error: 'Unknown error' })
    }
}

const getUserMessages = async (req, res, next) => {
    const userId = req.query.userId
    try {
        const user = await User.findOne({ _id: userId })
        if (!user) {
            res.status(404).json({ error: "Can't find user with given id" })
        } else {
            res.status(200).json({ messages: user.messages })
        }
    } catch (error) {
        res.status(500).json({ error: 'Unknown error' })
    }
}

const postMessage = async (req, res, next) => {
    const userId = req.user.id
    const { text } = req.body
    const file = req.file
    console.log(userId, text, file)
    try {
        const filePath = file.path
        const user = await User.findOne({ _id: userId })
        const newMessage = new Message({
            owner: req.user,
            text: text,
            replies: [],
        })
        await newMessage.save()
        await user.addMessage(newMessage)
        const result = await storage.bucket.upload(filePath)
        res.status(200).json({
            mediaLink: result[0].metadata.mediaLink,
        })
    } catch (error) {
        res.status(500).json({ error: 'Unknown error' })
    }
}

const postReply = async (req, res, next) => {
    const userId = req.user.id
    const { text, messageId } = req.body

    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            res.status(404).json({ error: "Can't find user with given id" })
        }
        const message = await Message.findOne({
            _id: messageId,
        })
        if (!message) {
            res.status(404).json({ error: "Can't find message with given id" })
        }
        const newReply = new Message({
            text: text,
            owner: req.user,
            parentMessageId: messageId,
            replies: [],
        })
        await message.addReply(newReply)
    } catch (error) {
        res.status(500).json({ error: 'Unknown error' })
    }
}

export {
    getAllMessages,
    getMessageById,
    getUserMessages,
    postMessage,
    postReply,
}
