import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        retuired: true,
    },

    email: {
        type: String,
        retuired: true,
    },

    password: {
        type: String,
        required: true,
    },
    messages: {
        messagesQty: {
            type: Number,
            default: 0,
        },
        data: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Message',
                required: true,
            },
        ],
    },
})

userSchema.methods.addMessage = async (message) => {
    const updatedMessages = this.messages
    updatedMessages.push(message)
    this.messages.messagesQty += 1
    this.messages.data = updatedMessages
    await this.save()
}

export default mongoose.model('User', userSchema)
