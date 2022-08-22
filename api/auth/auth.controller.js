const authService = require('./auth.service')
const logger = require('../../services/logger.service')


async function login(req, res) {
    //demo user password: 123
    const { username, password } = req.body
    try {
        const [refreshToken, accessToken] = await authService.login(username, password)
        res.cookie('accessToken', accessToken)
        res.send(refreshToken)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { username, password } = req.body
        const account = await authService.signup(username, password)
        logger.debug(`New account created: ` + JSON.stringify(account))
        const [refreshToken, accessToken] = await authService.login(username, password)
        logger.info('User login:', user.username)
        res.send(refreshToken, accessToken)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('accessToken')
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

async function issueToken(req, res) {
    const refreshToken = req.body['token']
    if (!refreshToken) return res.sendStatus(401)
    try {
        const newToken = await authService.issueToken(refreshToken)
        if (!newToken) return res.sendStatus(401)
        logger.info('Reissued token for user')
        res.cookie('accessToken', newToken)
        res.send(refreshToken)
    } catch (error) {
        logger.error('Failed to reissue refresh token:', error)
        res.sendStatus(401)
    }
}

async function validateToken(req, res) {
    try {
        const token = req.cookies['accessToken']
        await authService.validateAccessToken(token)
        res.status(200).send(token)
    } catch(error) {
        res.status(401).send(false)
    }
}

module.exports = {
    login,
    signup,
    logout,
    issueToken,
    validateToken,
}