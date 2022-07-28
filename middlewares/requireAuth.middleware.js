const logger = require('../services/logger.service')
const authService = require('../api/auth/auth.service')

async function requireToken(req, res, next) {
  logger.debug('requireAuth - req.headers', req.headers)
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  if (!token) return res.status(401).send('Not Authenticated!')
  try {
    await authService.validateAccessToken(token)
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
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
    res.status(403).end('Not Authorized')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireToken,
  requireRefreshToken,
  requireAdmin
}
