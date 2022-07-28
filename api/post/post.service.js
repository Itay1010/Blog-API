const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const pageSkip = filterBy.page - 1 === 0 ? 0 : (+filterBy.page - 1) * 4
        const collection = await dbService.getCollection('post')
        var posts = await collection.find(criteria).skip(pageSkip).limit(4).toArray()
        return posts
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
        const collection = await dbService.getCollection('post')
        const addedCar = await collection.insertOne(post)
        return addedCar
    } catch (err) {
        logger.error('cannot insert post', err)
        throw err
    }
}
async function update(post) {
    try {
        var id = ObjectId(post._id)
        delete post._id
        const collection = await dbService.getCollection('post')
        await collection.updateOne({ _id: id }, { $set: { ...post } })
        return post
    } catch (err) {
        logger.error(`cannot update post ${postId}`, err)
        throw err
    }
}

function _buildCriteria({ txt, inStock, label, page }) {
    const criteria = {}
    const pageSkip = 4
    const reg = { $regex: txt, $options: 'i' }
    if (txt) criteria.name = reg
    if (inStock !== '') criteria.inStock = JSON.parse(inStock)
    // if (+page) criteria.skip = +page - 1 === 0 ? 0 : (+page - 1) * 4
    return criteria
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}