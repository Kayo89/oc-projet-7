const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.post('/profile', userController.profile);
router.get('/profile/:id', userController.publicProfile);

router.put('/profile', multer, userController.editProfile)

router.put('/upload', multer, userController.uploadImage)

module.exports = router;