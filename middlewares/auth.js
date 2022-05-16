const jwt = require('../utils/jwt')
const createError = require('http-errors')
const auth = async (req, res, next) => {
    try {
    if (!req.headers.authorization) {
        return next(createError.Unauthorized('Access token is required'))
    }
    const token = req.headers.authorization;

    await jwt.verifyAccessToken(token);

    next();
    } catch (e) {
      next(createError.Unauthorized(e.message))
    }
}

module.exports = auth;