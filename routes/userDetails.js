const express = require('express');
const { getUserDetails, uploadUserDetails } = require('../controller/userDetails');

const router = express.Router();

router.route('/').get(getUserDetails).post(uploadUserDetails)

module.exports = router;