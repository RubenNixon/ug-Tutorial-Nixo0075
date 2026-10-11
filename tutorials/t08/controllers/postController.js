import Post from "../models/Post.js";

const createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ postID: req.params.postID });
    if (!post) {
      return res.status(404).json({ error: "Post missing" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { postID: req.params.postID },
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post missing" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ postID: req.params.postID });
    if (!deletedPost) {
      return res.status(404).json({ error: "Post missing" });
    }
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost };