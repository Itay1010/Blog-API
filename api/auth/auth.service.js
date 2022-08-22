const bcrypt = require('bcrypt')
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
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')
    delete user.password
    user.lastLogin = Date.now()
    await userService.update(user, `lastLogin="${user.lastLogin}"`)
    return [generateRefreshToken(user._id), generateAccessToken(user)]
}

async function signup(username, password) {
    const saltRounds = 10
    logger.debug(`auth.service - signup with username: ${username}`)
    if (!username || !password) return Promise.reject('username and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash })
}

//Token functions below 
async function validateAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, userWithExtra) => {
            if (err) {
                logger.error('Access token is invalid: ', err)
                reject(new Error(err))
            }
            resolve({
                _id: userWithExtra._id,
                username: userWithExtra.username,
                createdAt: userWithExtra.createdAt,
                lastLogin: userWithExtra.lastLogin,
                admin: userWithExtra.admin
            })

        })

    })

}

function generateAccessToken(user, expr = '15m') {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: expr })
}

function generateRefreshToken(userId, expr = '24h') {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: expr })
}

async function issueToken(token) {
    logger.debug('reissuing token')
    return new Promise((resolve, reject) => {
        jwt.verify(token, REFRESH_TOKEN_SECRET, async (error, userIdWithExtra) => {
            if (error) {
                logger.error('reissueToken', error)
                reject(error)
            }
            try {
                const rawUser = await userService.getById(userIdWithExtra.userId)
                if (!rawUser) {
                    logger.error('Failed to reissue token, user undefined')
                    reject(new Error('Failed to reissue token, user undefined'))
                }
                const user = {
                    _id: rawUser._id,
                    username: rawUser.username,
                    createdAt: rawUser.createdAt,
                    lastLogin: rawUser.lastLogin
                }
                const token = generateAccessToken(user)
                resolve(token)
            } catch (error) {
                reject(error)
            }

        })
    })
}

module.exports = {
    signup,
    login,
    validateAccessToken,
    issueToken
}