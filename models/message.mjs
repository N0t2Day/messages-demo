import mongoose, { Schema } from 'mongoose'

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    replies: {
        repliesQty: {
            type: Number,
            require: true,
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

messageSchema.methods.addReply = async (message) => {
    const updatedReplies = this.replies.data
    updatedReplies.push(message)
    this.replies.repliesQty += 1
    this.replies.data = updatedReplies
    await this.save()
}

export default mongoose.model('Message', messageSchema)
