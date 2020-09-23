const db = require('../config/database');
const DATE_FORMATER = require( 'dateformat' );

module.exports = (req, res, next) => {
    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress || 
            req.connection.socket.remoteAddress
    db.query("SELECT ip_address FROM BanIp", (err, result) => {
        for (let ipAddress of result){
            if (ip == ipAddress.ip_address){
                return res.status(401).json({error: "Connection bloqué ! Merci de contactez un Admin", errorCode: 40005})
            }
        }
        req.ip_address = ip;
        next();
    })
};