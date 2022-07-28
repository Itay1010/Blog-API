const authService = require('./auth.service')
const logger = require('../../services/logger.service')


async function login(req, res) {
    const { username, password } = req.body
    try {
        const [accessToken, refreshToken] = await authService.login(username, password)
        res.json({ accessToken, refreshToken })
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { username, password } = req.body
        // Never log passwords
        // logger.debug( + ', ' + username + ', ' + password)
        const account = await authService.signup(username, password)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

async function issueToken(req, res) {
    const refreshToken = req.body.token
    if(!refreshToken) return res.sendStatus(401)
    try {
        const newToken = await authService.issueToken(refreshToken)
        if(!newToken) return res.sendStatus(401)
        logger.info('Reissued token for user')
        res.send(newToken)
    } catch (error) {
        logger.error('Failed to reissue refresh token:', error)
        res.sendStatus(401)
    }
}

module.exports = {
    login,
    signup,
    logout,
    issueToken,
    issueRefreshToken
}