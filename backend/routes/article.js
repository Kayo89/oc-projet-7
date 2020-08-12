const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');
const auth = require('../middleware/auth');

router.post('/', auth, articleController.createArticle);

router.get('/', auth, articleController.getAllArticle);
router.get('/:id', auth, articleController.getOneArticle);

router.post('/reply', auth, articleController.replyToArticle);
router.delete('/reply', auth, articleController.deleteOneReply);

router.delete('/:id', auth, articleController.deleteArticle);


module.exports = router;