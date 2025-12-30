import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const Post = mongoose.model('Post', postSchema);