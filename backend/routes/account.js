const mongoose = require('mongoose');
const {account} = require('../db');
const express = require('express');
const router = express.Router();
const authmiddleware = require('../middleware/index');



router.get('/balance', authmiddleware, async (req,res) => {
    const userId = req.userId;
    const user = await account.findOne({
        userId : userId
    });
    const balance = user.Balance;
    res.status(200).json({
        balance : balance
    });
});

router.post('/transfer', authmiddleware, async (req, res) => {
    const session = await mongoose.startSession();
   
   session.startTransaction();
    const details = req.body;
    const userId = req.userId;

    if(!details.to) {
        await session.abortTransaction();
    
        res.status(400).json({
            msg : "please write the correct userId"
        });
    }
    try {
        const userAccount = await account.findOne({
            userId : userId
        }).session(session);

        if(!userAccount || userAccount.Balance < details.amount) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await account.findOne({
            userId : details.to
        }).session(session);

        if(!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "account does not found"
            });
        }

        await account.findOneAndUpdate({
            userId : details.to
        }, {
            $inc : { 
                Balance : details.amount
            }
        },{
            new : true
        }).session(session);

        await account.findOneAndUpdate({
            userId : userId
        },{
            $inc : {
                Balance : -details.amount
            }
        },{
            new : true
        }).session(session);

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
        
    }
    catch(err) {
        res.status(400).json({
            msg : "error occurred"
        });
    }
})

module.exports = router;