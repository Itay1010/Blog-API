const postService = require('./post.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getPosts(req, res) {
  try {
    logger.debug('Getting Posts')
    var queryParams = req.query
    const posts = await postService.query(queryParams)
    res.json(posts);
  } catch (err) {
    logger.error('Failed to get posts', err)
    res.status(500).send({ err: 'Failed to get posts' })
  }
}

// GET BY ID 
async function getPostById(req, res) {
  try {
    const postId = req.params.id;
    const post = await postService.getById(postId)
    res.json(post)
  } catch (err) {
    logger.error('Failed to get post', err)
    res.status(500).send({ err: 'Failed to get post' })
  }
}

// POST (add post)
async function addPost(req, res) {
  logger.debug('adding')
  try {
    const post = req.body;
    const addedPost = await postService.add(post)
    res.json(addedPost)
  } catch (err) {
    logger.error('Failed to add post', err)
    res.status(500).send({ err: 'Failed to add post' })
  }
}

// PUT (Update post)
async function updatePost(req, res) {
  try {
    const post = req.body;
    const updatedPost = await postService.update(post)
    res.json(updatedPost)
  } catch (err) {
    logger.error('Failed to update post', err)
    res.status(500).send({ err: 'Failed to update post' })

  }
}

// DELETE (Remove post)
async function removePost(req, res) {
  try {
    const postId = req.params.id;
    const removedId = await postService.remove(postId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove post', err)
    res.status(500).send({ err: 'Failed to remove post' })
  }
}

module.exports = {
  getPosts,
  getPostById,
  addPost,
  updatePost,
  removePost
}
