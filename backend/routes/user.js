const express = require("express");
const zod = require('zod');
const {JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {User, Account} = require('../db');
const {authMiddleware} = require('./middleware');


const signupBody = zod.object({
    userName : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string(),
});

router.post('/signup',async (req,res) => {
    const {success} = signupBody.safeParse(req.body);
    
    if(!success) {
        return res.status(411).json({
            message : "Email already taken/ Incorrect inputs"
        });
    }
    const existingUser = await User.findOne({
        userName : req.body.userName
    });
    if(existingUser) {
        return res.status(411).json({
            message : "Email already taken/ Incorrect Inputs"
        });
    }

    const user = await User.create({
        userName : req.body.userName,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
    });

    
    const userId = user._id;
    await Account.create({
        userId,
        balance : 1 + Math.random()*10000
    });

    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        message : "user created Successfully",
        token : token
    });

})
const SinginBody = zod.object({
    userName : zod.string().email(),
    password : zod.string()
});

router.post('/signin', async(req,res) => {
    const {success} = SinginBody.safeParse(req.body); 
    if(!success) {
        return res.status(411).json({
            message : "Incorrect login Inputs"
        });
    }

    const existingUser = await User.findOne({
        userName : req.body.userName,
        password : req.body.password
    });

    if(!existingUser) {
        return res.status(411).json({
            message : "userNotfound"
        });
    }
   

    const token = jwt.sign({
        userId : existingUser._id
    },JWT_SECRET);
    res.status(200).json({
        message : "user Singin successfully",
        token : token
    });
})
const updateSchema = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
});

router.put('/',authMiddleware, async(req,res) => {
    const {success} = updateSchema.safeParse(req.body);

    if(!success) {
        return res.status(411).json({
            message : "error while updating"
        });
    }

    await User.updateOne({
        _id : req.userId
    }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

router.get('/bulk', authMiddleware, async (req,res) => {
    const filter = req.query.filter||"";

    const users = await User.find({
        $or : [{
            firstName : {
                "$regex" : filter
            }
        }, {
            lastName : {
                "$regex" : filter
            }
        }]
    });

    res.json({
        user : users.map( user => ({
           userName : user.userName,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
})
module.exports = router;