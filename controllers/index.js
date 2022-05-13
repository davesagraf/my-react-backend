const express = require('express');
const router = express.Router();
const userService = require('../services/userService')

router.get('/users', userService.getUsers);

module.exports = router;
