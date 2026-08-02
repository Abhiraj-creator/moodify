const UserModel = require('../models/user.model');
const BlacklistModel = require('../models/blacklist.model')
const jwt = require('jsonwebtoken');
const redis= require('../config/cache')

const AuthuserMiddleware = async (req, res, next) => {

    let token = req.cookies.token;

    if (!token) {
        return res.status(400).json({
            message: "token not provided"
        })
    }
    const IsTokenBlacklisted = await redis.get(token)
    if (IsTokenBlacklisted) {
        return res.status(400).json({
            message: "unvalid token"
        })
    }
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw error
    }

    req.user = decoded;
    next();
}

module.exports = AuthuserMiddleware