import {Post} from "../model/post.model.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const { title, content } = req.body
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }
    const newPost = await Post.create({ title, content });
    try {
        res.status(201).json(newPost);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}