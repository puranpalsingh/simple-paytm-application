const mongoose = require('mongoose');
const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const {User, account} = require("../db");
const {JWT_SECRET} = require("../config");
const jwtMiddlwares = require("../middleware/index");


const route = express.Router();

const zodSchmea = zod.object({
    username : zod.string().min(3),
    firstName : zod.string().min(1),
    password : zod.string().min(6),
    lastName : zod.string().min(1)

});


route.post('/signup', async (req, res) => {
    try {
        const details = req.body;
        
        const result = zodSchmea.safeParse(details);
        if(result.success) {
     
            const response = await User.findOne({username : details.username});
            if(!response) {
             
                const newUser = await User.create({
                    username : details.username,
                    password : details.password,
                    firstName : details.firstName,
                    lastName : details.lastName
                });
                const userId = newUser._id;
                var token = jwt.sign({
                    userId
                }, JWT_SECRET);

                await account.create({
                    userId : newUser._id,
                    Balance : 1 + Math.random() * 1000
                });

            

                res.status(200).json({
                    msg: 'User created successfully', 
                    token : token  
                });
            }
            else { 
               
                return res.status(400).json({
                    msg : 'zod error occur'
                });
            }
        }
        else {
           
            return res.status(400).json({
                msg: 'Validation error',
                errors: result.error.errors
            });
        }
    }
    catch(err) {
       
        return res.status(411).json({
            msg : "error occured"
        });
    }

});

route.post('/signin', async (req, res) => {
    const details = req.body;
    try {
        const user = await User.findOne({
            username : details.username,
            password : details.password
        });
        if(!user) {
            return res.status(400).json({
                msg : "usernot found"
            });
        }
        const userId = user._id;
        var token = jwt.sign({
           userId
        }, JWT_SECRET);
        res.status(200).json({
            Token : token
        });
    }
    catch(err) {
        return res.status(400).json({
            msg : "error occured"
        });
    }
    
    
})

route.put('/update',jwtMiddlwares, async(req,res) => {
    const userId = req.userId;
    const details = req.body;
    try {
        const updateuser = await User.findOneAndUpdate({
            _id : userId
        }, {
            $set: {
            password : details.password,
            firstName : details.firstName,
            lastName : details.lastName
        }},{
            new : true,
            useFindAndModify : false
        });

        res.status(200).json({
            msg: "user update succesfully"
        });
    }
    catch(err) {
        res.status(400).json({
            msg : "error occured while updation"
        });
    }
});

route.get('/bulk', async (req, res) => {
    const username = req.query.filter;
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": username
            }
        }, {
            lastName: {
                "$regex": username
            }
        }]
    });
    res.json({
        users : users.map(user => ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            userId : user._id
        }))
    });
})


module.exports = route;