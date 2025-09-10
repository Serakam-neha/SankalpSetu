const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/', communityController.createPost);
router.get('/', communityController.getPosts);
router.get('/:id', communityController.getPostById);
router.put('/:id', communityController.updatePost);
router.delete('/:id', communityController.deletePost);
router.post('/:id/like', communityController.likePost);
router.post('/:id/comment', communityController.addComment);

module.exports = router;
