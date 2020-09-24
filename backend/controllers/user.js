const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DATE_FORMATER = require( 'dateformat' );
const fs = require('fs');
const ID_CONN = require('../config/user_id');
const TOKEN_KEY = ID_CONN.TOKEN();
const Ips =  require('../models/Ips');
let ips = [];

const User =  require('../models/User');
const { json } = require('body-parser');

exports.signup = (req, res, next) => {
    bcrypt.hash( req.body.password, 10 )
        .then(hash => {
            const user = new User( req.body.email, hash , req.body.lastName, req.body.firstName, req.body.gender)
            db.query("INSERT INTO User SET ?", user, function(err, result, fields) {
                if (err){
                    return res.status(500).json({ error: err.sqlMessage});
                }
                res.status(201).json({ message: result });
            })
        })
        .catch(() => res.status(500).json({ error: "Erreur d'enregistrement de l'utilisateur." }));
}
exports.login = (req, res, next) => {
    let ipfound = false;
    let ip = req.ip_address
    if (ips){
        for (let key in ips){
            if (ips[key].ip == ip){
                if (ips[key].count > 14){
                    const banIpDetails = {ip_address: ips[key].ip, add_date: DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" )}
                    db.query("INSERT INTO BanIp SET ?", banIpDetails, (err, result) => {
                        ips[key].count = 0;
                    })
                    return res.status(401).json({error: "Connection bloqué ! Merci de contactez un Admin", errorCode: 40005})
                }else{
                    ips[key].count++ ;
                    ipfound = true;
                }
            }
        }
        if (ipfound == false){
            ipfound = true
            ips.push(new Ips(ip))
        }
        if (ipfound == true){
            db.query("SELECT id,email,password,permission FROM User WHERE email='" + req.body.email + "'", (err, user) => {
                if (err) throw err;
                if (user.length < 1){
                    return res.status(401).json({ error: "Email et/ou mot de passe incorrect !", errorCode: 40001});
                }
                bcrypt.compare(req.body.password, user[0].password)
                    .then(valid => {
                        if (!valid){
                            return res.status(401).json({ error: 'Email et/ou mot de passe incorrect !', errorCode: 40001});
                        }
                        if (user[0].permission === -1){
                            return res.status(401).json({ error: 'Votre compte a été banni ! Merci de contacter un Admin.', errorCode: 40004});
                        }
                        for (let key in ips){
                            if (ips[key].ip == ip){
                                ips[key].count = 0;
                            }
                        }
                        res.status(200).json({
                            userId: user[0].id,
                            token: jwt.sign(
                                { userId: user[0].id, permission: user[0].permission},
                                TOKEN_KEY,
                                { expiresIn: '24h' }
                            )
                        });
                        let sql = "UPDATE User SET last_conn='"+ DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" ) + "' WHERE id="+ user[0].id;
                        db.query(sql, (err, result) => {
        
                        })
                    })
                    .catch(() => res.status(500).json({ error: "Erreur de la vérification du mot de passe.", errorCode: 40003 }))
            })
        }
    }
}

exports.profile = (req, res, next) => {
    const userId = req.headers.userid;
    db.query("SELECT User.email, User.account_created, User.photo_url, User.born_date, User.city, User.about_you, User.first_name, User.last_name, (SELECT COUNT(Reply.user_id) FROM Reply WHERE user_id = '"+ userId +"') AS nb_reply,(SELECT COUNT(Article.user_id) FROM Article WHERE user_id = '"+ userId +"') AS nb_article FROM User WHERE User.id = '"+ userId +"' ", (err, user) => {
        if(err){
            return res.status(500).json({error: err})
        }
        if (req.permission){
            res.status(200).json({user: user[0], permission: true})
        }else{
            res.status(200).json({user: user[0]})
        }
    })
}

exports.publicProfile = (req, res, next) => {
    const reqPath = (req.url).substring(1);
    const userId = reqPath.split("profile/");
    db.query("SELECT account_created, city, born_date, about_you, photo_url, last_conn, first_name, last_name, (SELECT COUNT(Reply.user_id) FROM Reply WHERE user_id = '"+ userId[1]+"') AS nb_reply,(SELECT COUNT(Article.user_id) FROM Article WHERE user_id = '"+ userId[1] +"') AS nb_article FROM User WHERE id='" + userId[1] + "' ", (err, user) => {
        if(err){
            return res.status(500).json({error: err})
        }
        res.status(200).json({user: user})
    })
}

exports.editProfile = (req, res, next) => {
    const userInfos = JSON.parse(req.body.user);
    function updateWithPhoto(){
        const user = [  
            userInfos.email,
            userInfos.first_name,
            userInfos.last_name,
            userInfos.born_date,
            userInfos.city,
            userInfos.about_you,
            req.file.filename,
            userInfos.userId
        ];
        db.query("UPDATE User SET email = ?, first_name = ?, last_name = ?, born_date = ?, city = ?, about_you = ? , photo_url = ? WHERE id= ?", user, (err, result) => {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            res.status(200).json({message: "Profile modifié"})
        })
    }
    if (req.file){
        db.query("SELECT photo_url FROM User WHERE id ='" + userInfos.userId + "'", (err, result) => {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            const filename = result[0].photo_url;
            if(filename == 'avatar-man.png' || filename == 'avatar-woman.png' ){
                updateWithPhoto()
            }else{
                fs.unlink(`images/${filename}`, () => {
                    updateWithPhoto()
                })
            }
        })
    }else{
        const user = [  
            userInfos.email,
            userInfos.first_name,
            userInfos.last_name,
            userInfos.born_date,
            userInfos.city,
            userInfos.about_you,
            userInfos.userId
                    ];
    db.query("UPDATE User SET email = ?, first_name = ?, last_name = ?, born_date = ?, city = ?, about_you = ? WHERE id= ?", user, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({message: "Profile modifié"})
    })

    }
}

exports.deleteAccount = (req, res, next) => {
    let userId = [req.body.deleteAccountId];
        db.query("UPDATE Reply SET user_id=0 WHERE user_id= ?", userId, (err, result) => {
            if(err){
                return res.status(500).json({ error: 'Error Delete Account', errorDetail: err})
            }
            db.query("UPDATE Article SET user_id=0 WHERE user_id= ?", userId, (err, result) => {
                if(err){
                    return res.status(500).json({ error: 'Error Delete Account', errorDetail: err})
                }
                        db.query("DELETE FROM User WHERE id= ?", userId, (err, result) => {
                            if(err){
                                return res.status(500).json({ error: 'Error Delete Account', errorDetail: err})
                            }
                            res.status(200).json({message: "Utilisateur Supprimé !"})
                        })
            })
        })
}

exports.changePassword = (req, res, next) => {
    const emailUser = [req.body.email];
    const passwords = req.body.passwords;
    db.query("SELECT id, email, password FROM User WHERE email= ?", emailUser, (err, result) => {
        if (err){
            return res.status(500).json({ error: 'Error Get User', errorDetail: err})
        }
        const user = result[0];
        bcrypt.compare(passwords.old, user.password)
            .then(valid => {
                if (!valid){
                    return res.status(200).json({ error: 'Mot de passe incorrect !'});
                }
                bcrypt.hash( passwords.new, 10 )
                    .then(hash => {
                        const userInfos = [hash, user.id]
                        db.query("UPDATE User SET password = ? WHERE id= ?", userInfos, (err, result) => {
                            if (err){
                                return res.status(500).json({ error: 'Error Update Password', errorDetail: err})
                            }
                            res.status(201).json({success: 'Mot de passe modifié !'})
                        })
                    })
                    .catch(() => res.status(500).json({ error: "Erreur d'enregistrement du nouveau mot de passe." }));
            })
            .catch(() => res.status(500).json({ error: "Erreur de la vérification du mot de passe." }))
    })
}