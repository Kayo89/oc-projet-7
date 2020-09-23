const db = require('../config/database');
const DATE_FORMATER = require( 'dateformat' );

const Article =  require('../models/Article');
const Reply =  require('../models/Reply');

exports.createArticle = (req, res, next) => {
    const article = new Article(req.body.userId, req.body.contentTxt, req.body.title);
    db.query("INSERT INTO Article SET ?", article, function(err, result) {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(201).json({ status: result , message: "Article Créé !"});
    })
}

exports.getAllArticle = (req, res, next) => {
    db.query("SELECT Article.id, Article.title, Article.likes, Article.dislikes, Article.date_created, Article.content_txt, Article.user_id, User.first_name, User.last_name, COUNT(Reply.article_id) AS replyCount FROM Reply RIGHT JOIN Article ON Reply.article_id = Article.id LEFT JOIN User ON Article.user_id = User.id GROUP BY Article.id ORDER BY Article.date_created DESC", 
        function(err, result) {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            res.status(200).json({ DATA: result});
    })
}

exports.getSortArticles = (req, res, next) => {
    const order = req.body.sort
    db.query("SELECT Article.id, Article.title, Article.date_created, Article.likes, Article.dislikes, Article.content_txt, Article.user_id, User.first_name, User.last_name, COUNT(Reply.article_id) AS replyCount FROM Reply RIGHT JOIN Article ON Reply.article_id = Article.id LEFT JOIN User ON Article.user_id = User.id GROUP BY Article.id ORDER BY " + order + " DESC LIMIT 5", 
        function(err, result) {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            res.status(200).json({ articles: result});
    })
}

exports.getOneArticle = (req, res, next) => {
    const id = (req.url).substring(1);
    let article = null;
    let reply = null;
    let permission = false;
    if (req.permission){
        permission = true
    }
    db.query("SELECT Article.id, Article.title, Article.content_txt, Article.likedUsers, Article.likes, Article.dislikedUsers, Article.dislikes, Article.date_created, Article.date_edit, Article.user_id, User.photo_url, User.first_name, User.last_name FROM Article LEFT JOIN User ON Article.user_id = User.id WHERE Article.id=" + id, 
        function(err, result) {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            article = result[0];
            db.query("SELECT Reply.id, Reply.date_edit, Reply.article_id, Reply.date_created, Reply.reply_txt, Reply.user_id, User.first_name, User.photo_url, User.last_name FROM Reply LEFT JOIN User ON Reply.user_id = User.id WHERE article_id = '" + article.id + "' ", 
                (err, result) => {
                    if (err){
                        return res.status(500).json({ error: err.sqlMessage});
                    }
                    reply = result;
                    res.status(200).json({ article: article, reply: reply, permission: permission});
            })
    })
}

exports.replyToArticle = (req, res, next) => {
    const reply = new Reply(req.body.userId, req.body.articleId, req.body.replyText);
    db.query("INSERT INTO Reply SET ?", reply, function(err, result) {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(201).json({ status: result , message: "Reply post !"});
    })
}

exports.deleteArticle = (req, res, next) => {
    const id = (req.url).substring(1);
    db.query("DELETE FROM Article WHERE id=" + id, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        db.query("DELETE FROM Reply WHERE article_id=" + id, (err, result) => {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            res.status(200).json({message: "Article Supprimé !"})
        })
    })
}

exports.deleteOneReply = (req, res, next) => {
    const replyId = req.body.replyId;
    db.query("DELETE FROM reply WHERE id=" + replyId, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({message: "Reply Supprimé !"})
    })
}
exports.getEditArticle = (req, res, next) => {
    const userId = parseInt(req.headers.userid);
    const id = (req.url).split('/edit/')
    db.query('SELECT Article.title, Article.content_txt, Article.user_id FROM Article WHERE id=' + parseInt(id[1]), (err, result) => {
        if (err){
            return res.status(500).json({error : err.sqlMessage})
        }
        if (userId !== result[0].user_id && req.permission === false){
            return res.status(401).json({error: 'Opération non autorisé !'})
        }
        res.status(200).json({article: result[0]})
    })
}

exports.editArticle = (req, res, next) => {
    const userId = parseInt(req.headers.userid);
    const article = [req.body.title, req.body.content_txt, DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" ), req.body.articleId];
    db.query('SELECT user_id FROM Article WHERE id=' + parseInt(req.body.articleId), (err, result) => {
        if (err){
            return res.status(500).json({error : err.sqlMessage})
        }
        if (userId !== result[0].user_id && req.permission === false){
            return res.status(401).json({error: 'Opération non autorisé !'})
        }
        db.query("UPDATE Article SET title = ?, content_txt = ?, date_edit = ? WHERE id= ?", article, (err, result) => {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            res.status(200).json({message: "Article modifié"})
        })
    })
}

exports.getOneReply = (req, res, next) => {
    const replyId = [req.body.replyId];
    db.query("SELECT * FROM Reply WHERE id= ?", replyId, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({reply: result})
    })
}

exports.editReply = (req, res, next) => {
    const reply = [req.body.reply_txt, DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" ), req.body.replyId];
    db.query("UPDATE Reply SET reply_txt = ?, date_edit = ? WHERE id= ?", reply, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({message: "Commentaire modifié"})
    })
}

exports.addNotationsToArticle = (req, res, next) => {
    const likeStatus = req.body.likeStatus;
    const articleId = req.body.articleId;
    const userId = req.headers.userid;

    db.query("SELECT * FROM Article WHERE id="+articleId, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        let updateNotation = null;

        if (likeStatus == 1){
            updateNotation = addNotation(
                likeStatus, 
                userId, 
                result[0].likedUsers, 
                result[0].dislikedUsers)
        }

        else if (likeStatus == -1){
            updateNotation = addNotation(
                likeStatus, 
                userId, 
                result[0].dislikedUsers, 
                result[0].likedUsers)
        }
        updateNotation.push(articleId);
        db.query("UPDATE Article SET likedUsers = ?, likes = ?, dislikedusers = ?, dislikes = ? WHERE id= ?", updateNotation, (err, result) => {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            res.status(200).json({ newLikeCount: updateNotation[1], newDislikeCount: updateNotation[3]})
        })
    })
}

function arrayRemove(arr, value) { 
    return arr.filter(function(elem){
        return elem != value; 
    });
};

function addNotation(likeStatus, userId, addNotationUsers, rmNotationUsers){
    let newNotationUsers = null;
    let newNotationUsersCount = 0;
    let newRmNotationUsers = null;
    let newRmNotationUsersCount = 0;
    let articleNewNotation = null;

    if (!addNotationUsers){ // Si aucun utilisateur est dans la liste like/dislike
        newNotationUsers = [userId];
        newNotationUsers = newNotationUsers.toString()
    }
    else{
        newNotationUsers = addNotationUsers.split(','); // Split la liste des utilisateurs en Array
        for (let userList of newNotationUsers) {
            if (userList == userId){ // Cherche si l'utilisateur ce trouve déjà dans la liste des like/dislike
                newNotationUsers = arrayRemove(newNotationUsers, userId); // Enleve l'ID utilisateur de la liste
                if (newNotationUsers == ''){
                    newNotationUsers = null;
                }else{
                    newNotationUsers = newNotationUsers.toString()
                }
            }
        }
        if(newNotationUsers == addNotationUsers){ // Si les deux listes d'utilisateur sont égaux, ça veut dire qu'il faut ajouter l'ID user
            newNotationUsers.push(userId)
            newNotationUsers = newNotationUsers.toString()
        }
    }
    
    if (rmNotationUsers){
        newRmNotationUsers = arrayRemove(rmNotationUsers.split(','), userId);
    }

    if (newRmNotationUsers){
        newRmNotationUsers = newRmNotationUsers.toString();
    }

    if (newNotationUsers){
        newNotationUsersCount = newNotationUsers.split(',').length
    }
    if (newRmNotationUsers){
        newRmNotationUsersCount = newRmNotationUsers.split(',').length
    }

    if (likeStatus == 1){
        articleNewNotation = [newNotationUsers, newNotationUsersCount, newRmNotationUsers, newRmNotationUsersCount];
    }
    else if (likeStatus == -1){
        articleNewNotation = [newRmNotationUsers, newRmNotationUsersCount, newNotationUsers, newNotationUsersCount];
    }

    return articleNewNotation;
}