
//requires
const express= require('express')
const Usercontroller=require('../controllers/user.controller');
const AuthuserMiddleware=require('../middlewares/auth.middleware')
const AuthRouter=express.Router();



/*
api :- /register 
POST req.body
*/
AuthRouter.post('/register',Usercontroller.UserRegisterController);

/*
api:- login
POST req.body
*/
AuthRouter.post('/login',Usercontroller.UserLoginController)


/*
api:- get-me
get protected api
*/
AuthRouter.get('/get-me',AuthuserMiddleware,Usercontroller.GetmeController)


/*
api:-logout
get
*/
AuthRouter.get('/logout',Usercontroller.UserLogoutController)
module.exports=AuthRouter;