const mongoose = require('mongoose');
const { Schema } = require('zod');

mongoose.connect('mongodb+srv://singhpuranpal12:WBLc5aZbDppdRthE@cluster0.u6d1ctn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

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

const User = mongoose.model('users', userschmea);

module.exports = {
    User
};