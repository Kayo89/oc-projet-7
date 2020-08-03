const db = require('../config/database');

exports.createArticle = (req, res, next) => {

}

exports.getAllArticle = (req, res, next) => {
    return res.status(200).json({ message: "Les articles sont ici !"});
}

exports.getOneArticle = (req, res, next) => {

}