const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
const app = require('./server')
app.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})