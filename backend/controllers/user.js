const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DATE_FORMATER = require( 'dateformat' );

const User =  require('../models/User');
const { json } = require('body-parser');

exports.signup = (req, res, next) => {
    bcrypt.hash( req.body.password, 10 )
        .then(hash => {
            const user = new User( req.body.email, hash )
            db.query("INSERT INTO User SET ?", user, function(err, result, fields) {
                if (err){
                    return res.status(500).json({ error: err.sqlMessage});
                }
                //res.status(201).json({ message: "Nouveau compte crée !" });
                res.status(201).json({ message: result });
            })
        })
        .catch(() => res.status(500).json({ error: "Erreur d'enregistrement de l'utilisateur." }));
}
exports.login = (req, res, next) => {
    db.query("SELECT id,email,password FROM User WHERE email='" + req.body.email + "'", (err, user) => {
        if (err) throw err;
        if (user.length < 1){
            return res.status(401).json({ error: "Utilisateur non trouvé !"});
        }
        bcrypt.compare(req.body.password, user[0].password)
            .then(valid => {
                if (!valid){
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user[0].id,
                    token: jwt.sign(
                        { userId: user[0].id },
                        '96qrenxT_kB6jFPYTB4Z.JHqGoc*hz2Awba8grEge_gHkzLcdghG9H4ssVaiPhFn',
                        { expiresIn: '24h' }
                    )
                });
                let sql = "UPDATE User SET last_conn='"+ DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" ) + "' WHERE id="+ user[0].id;
                db.query(sql, (err, result) => {
                    console.log("Date Update");
                })
            })
            .catch(() => res.status(500).json({ error: "Erreur vérification Password." }))
    })
}