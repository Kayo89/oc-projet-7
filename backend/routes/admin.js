const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');

router.get('/users', auth, adminController.usersList);

router.delete('/user', auth, adminController.deleteAccount);
router.put('/user', auth, adminController.banAccount);

module.exports = router;