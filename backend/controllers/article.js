const db = require('../config/database');

const Article =  require('../models/Article');

exports.createArticle = (req, res, next) => {
    console.log(req.body);
    const article = new Article(req.body.userId, req.body.contentTxt, req.body.title);
    db.query("INSERT INTO Article SET ?", article, function(err, result, fields) {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(201).json({ status: result , message: "Article Créé !"});
    })
}

exports.getAllArticle = (req, res, next) => {
    db.query("SELECT Article.id, Article.title, Article.content_txt, User.first_name, User.last_name FROM Article INNER JOIN User ON Article.user_id = User.id", function(err, result, fields) {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({ DATA: result});
    })
    //return res.status(200).json({ message: "Les articles sont ici !"});
}

exports.getOneArticle = (req, res, next) => {
    const id = (req.url).substring(1)
    db.query("SELECT Article.id, Article.title, Article.content_txt, Article.user_id, User.first_name, User.last_name FROM Article INNER JOIN User ON Article.user_id = User.id WHERE Article.id=" + id, function(err, result, fields) {
        if (err){
            return res.status(500).json({ error: err.sqlMessage});
        }
        res.status(200).json({ DATA: result});
    })
}