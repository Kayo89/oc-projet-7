const db = require('../config/database');

exports.usersList = (req, res, next) => {
    if (req.permission){
        db.query('SELECT id, email, account_created, last_conn, first_name, last_name, permission, ( SELECT  COUNT(*) FROM Article art WHERE art.user_id = User.id ) AS articleCount, ( SELECT  COUNT(*) FROM Reply reply WHERE reply.user_id = User.id ) AS replyCount FROM User', (err, result) => {
            if (err){
                return res.status(500).json({ error: 'Error Users List', errorDetail: err})
            }
            res.status(200).json({users: result, permission: true})
        })
    }else{
        res.status(200).json({error: "Non autorisé", permission: false})
    }
}

exports.deleteAccount = (req, res, next) => {
    if (req.permission){
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
    }else{
        res.status(200).json({error: "Non autorisé !", permission: false})
    }
}

exports.banAccount = (req, res, next) => {
    if (req.permission){
        const data = [req.body.permStatus, req.body.banAccountId]
        db.query("UPDATE User SET permission= ? WHERE id= ?", data, (err, result) => {
            if(err){
                return res.status(500).json({ error: 'Error Users List', errorDetail: err})
            }
            res.status(200).json({message: "Permission de l'utilisateur mis à jour !"})
        })
    }else{
        res.status(200).json({error: "Non autorisé !", permission: false})
    }
}