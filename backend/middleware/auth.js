const jwt = require('jsonwebtoken');
const ID_CONN = require('../config/user_id');
const TOKEN_KEY = ID_CONN.TOKEN();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, TOKEN_KEY);
        const userId = decodedToken.userId;
        if (parseInt(req.headers.userid) !== userId || !req.headers.userid){
            return res.status(401).json({error: '401 | Requête non authentifiée !'});
        }else{
            if (decodedToken.permission == 1){
                req.permission = true
            }
            next();
        }
    } catch (error) {
        res.status(401).json({error: 'Requête non authentifiée !!'});
    }
};