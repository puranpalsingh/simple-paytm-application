const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://singhpuranpal12:singhpuran12@cluster0.u6d1ctn.mongodb.net/paytm');

const userSchema = mongoose.Schema({
    userName : String,
    password : String,
    firstName : String,
    lastName : String,
});

const User = mongoose.model('user', userSchema);

const AccountSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }, 
    balance : {
        type : Number,
        required : true
    }
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = {
    User,
    Account
};


