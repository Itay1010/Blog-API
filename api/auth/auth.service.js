const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')
const jwt = require('jsonwebtoken')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ? ACCESS_TOKEN_SECRET : 'c950bb02008e2f6ca378Aab6453ed6364abEc5a5'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ? REFRESH_TOKEN_SECRET : '967c0633a02b2adb7097c515aba6f92c14364fc'

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user.lastLogin = Date.now()
    const savedUser = await userService.update(user, `lastLogin = ${user.lastLogin}`)
    // delete user._id
    return [jwt.sign(savedUser, REFRESH_TOKEN_SECRET, { expiresIn: '30m' }), generateAccessToken(user)]
}

async function signup(username, password) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}`)
    if (!username || !password) return Promise.reject('username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash })
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

async function validateAccessToken(accessToken) {
    return jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, userWithExtra) => {
        if (err) {
            logger.error('Access token is invalid: ', err)
            throw new Error(err)
        }
        return {
            _id: userWithExtra._id,
            username: userWithExtra.username,
            createdAt: userWithExtra.createdAt,
            lastLogin: userWithExtra.lastLogin
        }

    })

}


function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

async function reissueToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, async (error, userWithExtra) => {
        if (error) {
            logger.error('reissueToken', error)
            return Promise.reject(error)
        }
        return generateAccessToken(
            {
                _id: userWithExtra._id,
                username: userWithExtra.username,
                createdAt: userWithExtra.createdAt,
                lastLogin: userWithExtra.lastLogin
            })
    })
}

module.exports = {
    signup,
    login,
    getLoginToken,
    validateAccessToken,
    reissueToken
}