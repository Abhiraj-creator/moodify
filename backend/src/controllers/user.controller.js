//requires
const UserModel = require('../models/user.model')
const BlacklistModel=require('../models/blacklist.model')
const redis=require('../config/cache')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserRegisterController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const IsAlreadyRegistered = await UserModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if (IsAlreadyRegistered) {
            return res.status(409).json({
                message: 'username or email already exists'
            })
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET,
            {
                expiresIn: '3d'
            })

        res.cookie('token', token);

        res.status(201).json({
            message: 'user registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message });
    }
}


const UserLoginController = async (req, res) => {

    const { username, email, password } = req.body;

    const user = await UserModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    }).select('+password')

    if (!user) {
        return res.status(401).json({
            message: 'Invalid credentials'
        })
    }

    const IspasswordValid = await bcrypt.compare(password, user.password);

    if (!IspasswordValid) {
        return res.status(401).json({
            message: 'iinvalid credentials'
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })

    res.cookie('token', token);

    res.status(201).json({
        message: 'user loggedIn successfully ',

        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })


}


const GetmeController = async (req, res) => {

    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
        message: "user fetched successfully",
        user
    })
}


const UserLogoutController = async(req, res) => {
    const token = req.cookies.token
    res.clearCookie('token')

    await redis.set(token,Date.now().toString());

    res.status(200).json({
        message: 'user logged out successfully'
    })
}
module.exports = {
    UserRegisterController,
    UserLoginController,
    GetmeController,
    UserLogoutController
}