const express = require('express')
const { requireToken, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, deleteUser, updateUser } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
router.use(requireToken)

router.get('/', requireAdmin, getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)

// router.put('/:id',  requireToken, updateUser)
router.delete('/:id', requireAdmin, deleteUser)

module.exports = router