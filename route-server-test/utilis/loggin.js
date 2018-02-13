const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    printf
} = format;

const logFormat = printf(info => {
    return `${info.timestamp} - ${info.level}: ${info.message}`;
});

exports.logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({
            filename: 'info.log'
        })
    ]
});
// let currentDate = new Date.now();
// console.log(req.connection.remoteAddress,
//     req.connection.remotePort,
//     req.connection.localAddress,
//     req.connection.localPort);
// console.log(currentDate, this.SignInCounter)
// let signInDetailFailure =
//     'But still I\'m having memories of high' +
//     'speeds when the cops crashed\n' +
//     'As I laugh, pushin the gas while my Glocks blast\n' +
//     'We was young and we was dumb but we had heart';
// fs.writeFile('log.txt', signInDetailFailure, (err) => {
//     if (err) throw err;
// });