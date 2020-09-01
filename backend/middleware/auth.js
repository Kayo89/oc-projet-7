const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, '96qrenxT_kB6jFPYTB4Z.JHqGoc*hz2Awba8grEge_gHkzLcdghG9H4ssVaiPhFn');
        const userId = decodedToken.userId;
        if (req.body.userId !== userId || !req.body.userId){
            return res.status(401).json({error: '401 | Requête non authentifiée !'});
        }else{
            next();
        }
    } catch (error) {
        res.status(401).json({error: 'Requête non authentifiée !!'});
    }
};