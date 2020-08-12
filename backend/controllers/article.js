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
    db.query("SELECT Article.id, Article.title, Article.date_created, Article.content_txt, Article.user_id, User.first_name, User.last_name, COUNT(Reply.article_id) AS replyCount FROM Reply RIGHT JOIN Article ON Reply.article_id = Article.id INNER JOIN User ON Article.user_id = User.id GROUP BY Article.id ORDER BY replyCount DESC", 
        function(err, result) {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            res.status(200).json({ DATA: result});
    })
}

exports.getOneArticle = (req, res, next) => {
    const id = (req.url).substring(1);
    let article = null;
    let reply = null;
    db.query("SELECT Article.id, Article.title, Article.content_txt, Article.date_created, Article.date_edit, Article.user_id, User.first_name, User.last_name FROM Article INNER JOIN User ON Article.user_id = User.id WHERE Article.id=" + id, 
        function(err, result) {
            if (err){
                return res.status(500).json({ error: err.sqlMessage});
            }
            article = result[0];
            db.query("SELECT Reply.id, Reply.article_id, Reply.date_created, Reply.reply_txt, Reply.user_id, User.first_name, User.last_name FROM Reply INNER JOIN User ON Reply.user_id = User.id WHERE article_id = '" + article.id + "' ", 
                (err, result) => {
                    if (err){
                        return res.status(500).json({ error: err.sqlMessage});
                    }
                    reply = result;
                    res.status(200).json({ article: article, reply: reply});
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

exports.editArticle = (req, res, next) => {
    const article = [req.body.title, req.body.content_txt, DATE_FORMATER( new Date(), "yyyy-mm-dd HH:MM:ss" ), req.body.articleId];
    db.query("UPDATE Article SET title = ?, content_txt = ?, date_edit = ? WHERE id= ?", article, (err, result) => {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({message: "Article modifié"})
    })
}