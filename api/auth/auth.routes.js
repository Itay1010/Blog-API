const express = require('express')
const {login, signup, logout, issueToken, issueRefreshToken} = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/token', issueToken)

module.exports = router