const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://singhpuranpal12:WBLc5aZbDppdRthE@cluster0.u6d1ctn.mongodb.net/paytm-application?retryWrites=true&w=majority&appName=Cluster0')
.then (() => {
    console.log('mongoose connect successfully');
});

const userschmea = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        minLength : 3,
        maxLength : 9,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
    },
    firstName : {
        type : String,
        required : true,
        maxLength : 50,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        maxLength : 50,
        trim : true
    }
});
const AccountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User',
        required : true
    },
    Balance : {
        type : Number,
        required : true
    }
});

const account = mongoose.model('accounts',AccountSchema);
const User = mongoose.model('users', userschmea);

module.exports = {
    User,
    account
};