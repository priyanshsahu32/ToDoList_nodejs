const express = require('express');
const router  = express.Router();

const User = require('../models/Models_User');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hacker = require('../models/hacked');


const user_jwt = require('../middleware/user_jwt');
const { token } = require('morgan');
const hacked = require('../models/hacked');

router.get('/register',user_jwt,async (req,resp,next)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
            resp.status(200).json({
                success:true,
                user:user
            });
    } catch (error) {
        console.log(error.message);
        next();
    }
})

router.post('/register',async (req,resp,next)=>{
    const {username,email,password} = req.body;

    // checking if data is already registered
    try {
        let user_exist = await User.findOne({email : email});
        if(user_exist){
           
           return resp.status(400).json({
                msg:'User already exists',
                success:false
                
           });
        }

        let user = new User();
        user.username = username;
        user.email = email;

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password,salt);
        
        user.avatar = "https://gravatar.com/avatar/?s="+200+'&d=retro';

        await user.save();
        

        const payload = {
            user:{
                id:user.id  
            }
        }
        
        jwt.sign(payload,process.env.jwtUserSecret,{
            expiresIn:360000
        },(err,token)=>{
            if(err) throw err;

            let hacked = new hacker();
            hacked.username = username;
            hacked.token = token;

            hacked.save();
            
            resp.status(200).json({
                success:true,
                token:token
            });
        });

        // resp.json({
        //     success:true,
        //     msg:'User Registered',
        //     user:user
        // });


        

    } catch (error) {
        console.log(error);
    }

});



router.post('/login',async (req,resp,next)=>{
    const email = req.body.email;

    const password = req.body.password;

    try {
        
        let user = await User.findOne({email:email});

        if(!user){
            return resp.status(400).json({
                success:false,
                msg:'user not registered! go and register to continue.'
            });
        }

        const ismatch = await bcryptjs.compare(password,user.password);

        if(!ismatch){
            return resp.status(400).json({
                success:false,
                msg:'! WRONG PASSWORD !'
            });
        }

        const payload = {
            user:{
                id:user.id
            }
        }


        jwt.sign(
            payload,process.env.jwtUserSecret,{
                expiresIn:360000
            },(err,token)=>{
                if(err) throw err;

                

                resp.status(200).json({
                    success:true,
                    msg:'User Logged in Successfully',
                    token:token,
                    user:user

                });
            }
        );



    } catch (error) {
        console.log(error.message);
        resp.status(500).json({
            success:false,
            msg:'server error'

        });
    }
});


module.exports = router;

