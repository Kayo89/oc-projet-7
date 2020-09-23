const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');
const auth = require('../middleware/auth');

router.post('/', auth, articleController.createArticle);

router.get('/', articleController.getAllArticle);
router.get('/:id', auth, articleController.getOneArticle);

router.post('/sort', auth, articleController.getSortArticles);

router.post('/reply', auth, articleController.replyToArticle);
router.delete('/reply', auth, articleController.deleteOneReply);

router.get('/edit/:id', auth, articleController.getEditArticle)
router.put('/edit', auth, articleController.editArticle);
router.delete('/:id', auth, articleController.deleteArticle);

router.post('/notation', auth, articleController.addNotationsToArticle);

router.post('/reply/modify', auth, articleController.getOneReply);
router.put('/reply', auth, articleController.editReply);


module.exports = router;