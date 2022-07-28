const express = require('express')
const { requireToken, requireRefreshToken, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getPosts, getPostById, addPost, updatePost, removePost } = require('./post.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireToken)

router.get('/', log, requireToken, getPosts)
router.get('/:id', requireToken, getPostById)
router.post('/', requireToken, requireAdmin, addPost)
router.put('/:id', requireToken, requireAdmin, updatePost)
router.delete('/:id', requireToken, requireAdmin, removePost)
// debug routes
// router.post('/', addPost)
// router.put('/:id', updatePost)
// router.delete('/:id', removePost)

module.exports = router