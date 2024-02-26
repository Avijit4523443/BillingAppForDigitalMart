const express = require('express');
const { signup, login } = require(".././controller/auth");
const router = express.Router();

router.route('/').post(signup,login)

module.exports = router;