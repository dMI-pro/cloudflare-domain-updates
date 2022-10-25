const {createLogger, transports, format} = require('winston');


const customerLoggerInfo = createLogger({
    transports: [
        new transports.File({
            filename: './source/logs/out.log',
            level: 'info',
            format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm;ss'}), format.json())
        })
    ]
})
const customerLoggerError = createLogger({
    transports: [
        new transports.File({
            filename: './source/logs/error.log',
            level: 'error',
            format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm;ss'}), format.json())
        })
    ]
})

module.exports = {customerLoggerInfo, customerLoggerError }
