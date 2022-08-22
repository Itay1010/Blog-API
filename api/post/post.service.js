const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const queryStr = `SELECT * FROM post ${criteria}`
        const db = await dbService.getDb()
        return new Promise((resolve, reject) => {
            db.query(queryStr, (err, result, fields) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}

async function getById(postId) {
    try {
        const collection = await dbService.getCollection('post')
        const post = collection.findOne({ _id: ObjectId(postId) })
        return post
    } catch (err) {
        logger.error(`while finding post ${postId}`, err)
        throw err
    }
}

async function remove(postId) {
    try {
        const collection = await dbService.getCollection('post')
        await collection.deleteOne({ _id: ObjectId(postId) })
        return postId
    } catch (err) {
        logger.error(`cannot remove post ${postId}`, err)
        throw err
    }
}

async function add(post) {
    try {
        const { title, description, body, imgUrl } = post
        const db = await dbService.getDb()
        const queryStr = `INSERT INTO post (title, description, body, imgUrl) VALUES (${title}, ${description}, ${body}, ${imgUrl})`
        return new Promise((resolve, reject) => {
            db.query(queryStr, (err, result, fields) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    } catch (err) {
        logger.error('cannot insert post', err)
        throw err
    }
}
async function update(postField) {
    try {
        const db = await dbService.getDb()
        const queryStr = `UPDATE post SET ${Object.keys(postField).map(field => {
            if (field !== '_id') return `${field} = ${postField[field]}`
        })}`
        return new Promise((resolve, reject) => {
            db.query(queryStr, (err, result, fields) => {
                if (err) reject(err)
                resolve(result)
            })
        })
        return post
    } catch (err) {
        logger.error(`cannot update post ${postId}`, err)
        throw err
    }
}

function _buildCriteria({ txt, count, page, orderBy }) {
    let criteria = ' '
    if (orderBy) criteria += `ORDER BY ${orderBy} `
    else if (page)`ORDER BY createdAt `
    if (count) criteria += `LIMIT ${count} `
    if (page & count) criteria += `OFFSET ${page} `
    if (txt) criteria += `WHERE MATCH(title, description) AGAINST ('${txt}' IN BOOLEAN MODE) `
    return criteria
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}