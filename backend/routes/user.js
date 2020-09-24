const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');
const checkIp = require('../middleware/ips');
const auth = require('../middleware/auth');

router.post('/signup', checkIp, userController.signup)
router.post('/login', checkIp, userController.login)

router.post('/profile', auth, userController.profile)
router.get('/profile/:id', auth, userController.publicProfile)

router.put('/profile', auth, multer, userController.editProfile)

router.delete('/del-account', auth, userController.deleteAccount)

router.put('/password', auth, userController.changePassword)

module.exports = router;