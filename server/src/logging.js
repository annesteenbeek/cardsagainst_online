"use strict";

const winston = require('winston')
const utils = require('./utils');

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`,
    )
);

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.cli(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.Console()
    ]
})

if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({
        filename: 'error.log', level: 'error'
    }))
}

module.exports = function(file_path) {    
    const file_name = utils.split_path(file_path);
    var myLogger = {
        error: function(text) {
            logger.error(file_name + ': ' + text)
        },
        info: function(text) {
            logger.info(file_name + ': ' + text)
        }
    }

    return myLogger
}