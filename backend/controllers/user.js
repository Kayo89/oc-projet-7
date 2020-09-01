const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DATE_FORMATER = require( 'dateformat' );
const fs = require('fs');

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
    db.query("SELECT id,email,password FROM User WHERE email='" + req.body.email + "'", (err, user) => {
        if (err) throw err;
        if (user.length < 1){
            return res.status(401).json({ error: "Utilisateur non trouvé !", errorCode: 40001});
        }
        bcrypt.compare(req.body.password, user[0].password)
            .then(valid => {
                if (!valid){
                    return res.status(401).json({ error: 'Mot de passe incorrect !', errorCode: 40002});
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
                    //console.log("Date Update");
                })
            })
            .catch(() => res.status(500).json({ error: "Erreur vérification Password.", errorCode: 40003 }))
    })
}

exports.profile = (req, res, next) => {
    db.query("SELECT User.email, User.account_created, User.photo_url, User.born_date, User.city, User.about_you, User.first_name, User.last_name, (SELECT COUNT(Reply.user_id) FROM Reply WHERE user_id = '"+ req.body.userId +"') AS nb_reply,(SELECT COUNT(Article.user_id) FROM Article WHERE user_id = '"+ req.body.userId +"') AS nb_article FROM User WHERE User.id = '"+ req.body.userId +"' ", (err, user) => {
        if(err){
            console.log("Error : " + err);
            return res.status(500).json({error: err})
        }
        res.status(200).json({user: user})
    })
}

exports.detailsProfile = (req, res, next) => {
    //const userId = [req.body.userId, req.body.userId, req.body.userId];
    db.query("SELECT User.email, User.account_created, User.photo_url, User.first_name, User.last_name, (SELECT COUNT(Reply.user_id) FROM Reply WHERE user_id = '"+ req.body.userId +"') AS nb_reply,(SELECT COUNT(Article.user_id) FROM Article WHERE user_id = '"+ req.body.userId +"') AS nb_article FROM User WHERE User.id = '"+ req.body.userId +"' ", (err, user) => {
        if(err){
            console.log("Error : " + err);
            return res.status(500).json({error: err})
        }
        res.status(200).json({user: user})
    })
}

exports.publicProfile = (req, res, next) => {
    const reqPath = (req.url).substring(1);
    const userId = reqPath.split("profile/");
    db.query("SELECT account_created, city, born_date, about_you, photo_url, last_conn, first_name, last_name, (SELECT COUNT(Reply.user_id) FROM Reply WHERE user_id = '"+ userId[1]+"') AS nb_reply,(SELECT COUNT(Article.user_id) FROM Article WHERE user_id = '"+ userId[1] +"') AS nb_article FROM User WHERE id='" + userId[1] + "' ", (err, user) => {
        if(err){
            console.log("Error : " + err);
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
        
        console.log(userInfos.userId)
        db.query("SELECT photo_url FROM User WHERE id ='" + userInfos.userId + "'", (err, result) => {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            console.log(result)
            const filename = result[0].photo_url;
            console.log(filename)
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
        console.log(user)
    db.query("UPDATE User SET email = ?, first_name = ?, last_name = ?, born_date = ?, city = ?, about_you = ? WHERE id= ?", user, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({message: "Profile modifié"})
    })

    }
}

exports.uploadImage = (req, res, next) => {
    console.log(req.file)
    res.json({file: req.file})
}