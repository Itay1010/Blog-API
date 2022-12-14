const express = require('express')
const { requireToken, requireRefreshToken, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getPosts, getPostById, addPost, updatePost, removePost } = require('./post.controller')
const router = express.Router()

// middleware that is specific to this router
router.use(requireToken)

router.get('/', getPosts)
router.get('/:id', getPostById)
router.post('/', addPost)
router.put('/:id', updatePost)
router.delete('/:id', requireAdmin, removePost)

module.exports = router