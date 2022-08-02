const logger = require('../services/logger.service')
const authService = require('../api/auth/auth.service')
const jwt = require('jsonwebtoken')

async function requireToken(req, res, next) {
  //Token should also be in header to protect from CSRF
  const tokenFromCookie = req.cookies['accessToken']
  const tokenFromHeader = req.headers['authorization']?.split(' ')[1]
  if (!tokenFromCookie || tokenFromCookie !== tokenFromHeader) return res.status(401).send('Not Authenticated!')
  try {
    await authService.validateAccessToken(tokenFromHeader)
    next()
  } catch (error) {
    logger.error('Failed to verify access token:', error)
    res.status(401).send('Not Authenticated')
  }
}

async function requireRefreshToken(req, res, next) {
  logger.debug('requireAuth - loggedinUser', req.cookies)
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  next()
}

async function requireAdmin(req, res, next) {
  //Token should also be in header to protect from CSRF
  const tokenFromCookie = req.cookies['accessToken']
  const tokenFromHeader = req.headers['authorization']?.split(' ')[1]
  if (!tokenFromCookie || tokenFromCookie !== tokenFromHeader) return res.status(401).send('Not Authenticated!')
  try {
    const user = await authService.validateAccessToken(tokenFromHeader)
    if(!user.isAdmin) throw new Error('User unauthorized')
    next()
  } catch (error) {
    logger.error('Failed to verify access token:', error)
    res.status(401).send('Not unauthorized')
  }
}


// module.exports = requireAuth

module.exports = {
  requireToken,
  requireRefreshToken,
  requireAdmin
}
