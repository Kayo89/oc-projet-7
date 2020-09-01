const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');
const auth = require('../middleware/auth');

router.post('/', auth, articleController.createArticle);

router.get('/', articleController.getAllArticle);
router.get('/:id', articleController.getOneArticle);

router.post('/reply/modify', articleController.getOneReply);

router.post('/new', articleController.getLastArticle);

router.post('/reply', auth, articleController.replyToArticle);
router.delete('/reply', auth, articleController.deleteOneReply);

router.delete('/:id', auth, articleController.deleteArticle);
router.put('/edit', auth, articleController.editArticle);

router.post('/notation', articleController.addNotationsToArticle)

router.put('/reply', articleController.editReply);


module.exports = router;