const express = require('express')
const {reissueToken, issueToken, reissueRefreshToken} = require('./token.controller')

const router = express.Router()

router.post('/', issueToken)
router.post('/reissue', reissueToken)
router.post('/reissue/refresh', reissueRefreshToken)


module.exports = router