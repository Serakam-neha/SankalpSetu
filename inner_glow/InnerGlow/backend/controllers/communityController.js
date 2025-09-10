const CommunityPost = require('../models/CommunityPost');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, isAnonymous } = req.body;
    const userId = req.user?.id; // Assuming auth middleware sets req.user
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const post = new CommunityPost({
      userId,
      title,
      content,
      category: category || 'general',
      isAnonymous: isAnonymous || false
    });
    
    await post.save();
    await post.populate('userId', 'name email');
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('userId', 'name email')
      .populate('comments.userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('comments.userId', 'name email');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { title, content, category, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const likeIndex = post.likes.indexOf(userId);
    let isLiked = false;

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
      isLiked = true;
    }

    await post.save();
    res.json({ isLiked, likesCount: post.likes.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({
      userId,
      content
    });
    
    await post.save();
    await post.populate('comments.userId', 'name email');
    
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};